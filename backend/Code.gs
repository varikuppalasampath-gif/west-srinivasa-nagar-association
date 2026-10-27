/** West Srinivasa Nagar Association - backend (public data, contact form, secure admin + uploads) */
const SHEET_ID = '';                              // leave empty if opened from inside the sheet
const CLIENT_ID = '95744026917-fo3f8omsura363l9rv36od5kpl3h6odq.apps.googleusercontent.com';  // same value as GOOGLE_CLIENT_ID in index.html
const UPLOAD_FOLDER = 'WSN Uploads';
const T = {announcements:'Announcements', events:'Events', gallery:'Gallery', committee:'Committee', houses:'Houses'};
const COLS = {
  announcements:['id','title','category','description','image_url','attachment_url','published_at','expires_at'],
  events:['id','title','description','event_date','start_time','venue','image_url'],
  gallery:['id','title','category','alt','image_url'],
  committee:['id','name','designation','term','public_contact','photo_url'],
  houses:['house_id','house_number','owner_display_name','block','street_or_lane','property_type','x','y']};
const LIVE = {announcements:['published'], events:['published','cancelled'], gallery:['published'], committee:['published'], houses:['active']};
const EDITOR = ['announcements','events','gallery'];

const book = () => SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActive();
const out = (ok, message, data) => ContentService.createTextOutput(JSON.stringify({success: ok, message: message, data: data || null})).setMimeType(ContentService.MimeType.JSON);
const bad = m => { throw new Error('!' + m); };
const safe = s => { s = String(s == null ? '' : s).trim(); return /^[=+\-@]/.test(s) ? "'" + s : s; };

function readAll(name) {
  const sh = book().getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  const rg = sh.getDataRange(), v = rg.getValues(), d = rg.getDisplayValues(), h = v[0], res = [];
  for (let i = 1; i < v.length; i++) {
    const o = {};
    h.forEach((c, j) => { const x = v[i][j];
      o[c] = x instanceof Date ? (x.getFullYear() < 1950 ? d[i][j] : Utilities.formatDate(x, 'Asia/Kolkata', 'yyyy-MM-dd')) : String(x); });
    res.push(o);
  }
  return res;
}

function readPublic(key) {
  const cache = CacheService.getScriptCache(), ck = 'pub3_' + key, hit = cache.get(ck);
  if (hit) return JSON.parse(hit);
  const cols = COLS[key].concat(key === 'events' || key === 'houses' ? ['status'] : []);
  const rows = readAll(T[key]).filter(r => LIVE[key].includes(r.status))
    .map(r => Object.fromEntries(cols.filter(f => f in r).map(f => [f, r[f]])));
  cache.put(ck, JSON.stringify(rows), 300);
  return rows;
}

function doGet(e) {
  try {
    const a = e.parameter.action || 'all';
    if (a === 'all') { const d = {}; Object.keys(T).forEach(k => d[k] = readPublic(k)); return out(true, 'OK', d); }
    if (T[a]) return out(true, 'OK', readPublic(a));
    return out(false, 'Unknown action');
  } catch (err) { console.error(err); return out(false, 'Unable to process the request'); }
}

function who(token) {
  if (!token) bad('Forbidden');
  const r = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(token), {muteHttpExceptions: true});
  if (r.getResponseCode() !== 200) bad('Forbidden');
  const t = JSON.parse(r.getContentText());
  if (t.aud !== CLIENT_ID || String(t.email_verified) !== 'true' || +t.exp < Date.now() / 1000) bad('Forbidden');
  const m = readAll('Admins').find(a => a.email.toLowerCase().trim() === String(t.email).toLowerCase());
  if (!m || !['admin','editor'].includes(m.role.toLowerCase().trim())) bad('Forbidden');
  return {email: t.email, role: m.role.toLowerCase().trim()};
}

function folder(sub) {
  const root = DriveApp.getFoldersByName(UPLOAD_FOLDER), r = root.hasNext() ? root.next() : DriveApp.createFolder(UPLOAD_FOLDER);
  const s = r.getFoldersByName(sub);
  return s.hasNext() ? s.next() : r.createFolder(sub);
}

function upload(key, name, mime, data) {
  if (!['image/jpeg','image/png','image/webp','application/pdf'].includes(mime)) bad('File type not allowed');
  const bytes = Utilities.base64Decode(data);
  if (bytes.length > 8 * 1024 * 1024) bad('File too large');
  const f = folder(key).createFile(Utilities.newBlob(bytes, mime, String(name).replace(/[^\w.\-]/g, '_').slice(0, 80)));
  f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);   // only this file, never the folder
  return mime === 'application/pdf' ? 'https://drive.google.com/file/d/' + f.getId() + '/view'
                                    : 'https://drive.google.com/thumbnail?id=' + f.getId() + '&sz=w1400';
}

function save(key, row, publish) {
  const sh = book().getSheetByName(T[key]), h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0], idk = key === 'houses' ? 'house_id' : 'id', o = {};
  COLS[key].forEach(c => { if (row[c] != null) { o[c] = safe(row[c]).slice(0, c === 'description' ? 1000 : 300);
    if (/_url$/.test(c) && o[c] && !/^https:\/\//.test(o[c])) o[c] = ''; } });
  if (key === 'houses') { o.house_number = String(o.house_number || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase(); if (!o.house_number) bad('House number required');
    o.house_id = 'WSN-' + o.house_number.padStart(3, '0'); if (readAll('Houses').some(r => r.house_id === o.house_id)) bad('House already exists'); }
  else { if (!(o.title || o.name)) bad('Title required'); o.id = Utilities.getUuid().slice(0, 8); }
  if (key === 'announcements' && !o.published_at) o.published_at = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
  o.status = publish ? (key === 'houses' ? 'active' : 'published') : (key === 'houses' ? 'inactive' : 'draft');
  const r = sh.getLastRow() + 1;
  sh.getRange(r, 1, 1, h.length).setNumberFormat('@').setValues([h.map(c => o[c] != null ? o[c] : '')]);
  return {id: o[idk]};
}

function setStatus(key, id, status) {
  if (!['published','draft','active','inactive'].includes(status)) bad('Bad request');
  const sh = book().getSheetByName(T[key]), v = sh.getDataRange().getValues(), h = v[0], ci = h.indexOf(key === 'houses' ? 'house_id' : 'id'), si = h.indexOf('status');
  for (let i = 1; i < v.length; i++) if (String(v[i][ci]) === String(id)) { sh.getRange(i + 1, si + 1).setValue(status); return {id: id}; }
  bad('Record not found');
}

function log(email, op, sheet, detail) {
  try { const sh = book().getSheetByName('AuditLog'); if (sh) sh.appendRow([new Date().toISOString(), email, op, sheet, String(detail || '').slice(0, 100)]); } catch (e) {}
}

function admin(b) {
  const w = who(b.token), k = b.sheet;
  if (b.op === 'whoami') return w;
  if (k !== 'enquiries' && !T[k]) bad('Bad request');
  if (w.role !== 'admin' && !EDITOR.includes(k)) bad('Forbidden');
  if (b.op === 'list') return k === 'enquiries' ? readAll('ContactSubmissions').slice(-100).reverse() : readAll(T[k]);
  if (k === 'enquiries') bad('Forbidden');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    let res;
    if (b.op === 'upload') res = {url: upload(k, b.name, b.mime, b.data)};
    else if (b.op === 'save') res = save(k, b.row || {}, !!b.publish);
    else if (b.op === 'status') res = setStatus(k, b.id, b.status);
    else bad('Bad request');
    CacheService.getScriptCache().removeAll(Object.keys(T).map(x => 'pub3_' + x));
    log(w.email, b.op, k, (res && (res.id || res.url)) || '');
    return res;
  } finally { lock.releaseLock(); }
}

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.action === 'admin') return out(true, 'OK', admin(b));
    if (b.action !== 'contact') return out(false, 'Unknown action');
    const name = safe(b.name).slice(0, 80), email = safe(b.email).slice(0, 120), phone = safe(b.phone).slice(0, 15), msg = safe(b.message).slice(0, 1000),
          cat = ['General','Maintenance','Event','Feedback'].includes(b.category) ? b.category : 'General';
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || msg.length < 10) return out(false, 'Invalid input');
    const cache = CacheService.getScriptCache(), rk = 'rl_' + email.toLowerCase();
    if (cache.get(rk)) return out(false, 'Please wait before sending another enquiry');
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try { book().getSheetByName('ContactSubmissions').appendRow([Utilities.getUuid(), name, email, phone, cat, msg, new Date().toISOString(), 'new']); }
    finally { lock.releaseLock(); }
    cache.put(rk, '1', 60);
    return out(true, 'Received');
  } catch (err) {
    console.error(err);
    return out(false, err.message && err.message[0] === '!' ? err.message.slice(1) : 'Unable to process the request');
  }
}
