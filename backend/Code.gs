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

/**
 * EXACT FOLDER IMPORT: Uses your Bathukamma folder ID directly
 * Folder URL: https://drive.google.com/drive/folders/1tpKpofdT3suiPOMNr_n-Rrs0xzrJLJba
 */

/**
 * ============================================================================
 * PARENT FESTIVAL FOLDER AUTO-SCANNER
 * ============================================================================
 * Parent Folder: https://drive.google.com/drive/folders/1Kq2lWakUlyD7Ni1mJctBx4S0FXMKgJjV
 *
 * HOW IT WORKS:
 * 1. Scans the parent folder and every sub-folder inside it.
 * 2. If an image is in a sub-folder (e.g., "Bathukamma", "Deepavali", "Plantation"),
 *    the subfolder name automatically becomes its category / tab on the website!
 * 3. Also scans images directly in the root of the folder.
 * 4. Plus checks any individual folder IDs listed in INDIVIDUAL_FOLDERS.
 */
const MAIN_FESTIVALS_FOLDER_ID = '1Kq2lWakUlyD7Ni1mJctBx4S0FXMKgJjV';

const INDIVIDUAL_FOLDERS = [
  {
    folderId: '1tpKpofdT3suiPOMNr_n-Rrs0xzrJLJba',
    category: 'Bathukamma',
    defaultTitle: 'Bathukamma',
    altText: 'Bathukamma festival'
  }
];

/**
 * 2-WAY MIRROR SYNC WITH GOOGLE DRIVE:
 * 1. Scans MAIN_FESTIVALS_FOLDER_ID, all subfolders (recursively), INDIVIDUAL_FOLDERS,
 *    and any standalone colony folders like "Community Meeting".
 * 2. If a photo was deleted or trashed in Google Drive:
 *    -> It is AUTOMATICALLY REMOVED from the Google Sheet!
 * 3. If a new photo or video is uploaded to Google Drive:
 *    -> It is AUTOMATICALLY ADDED to the Google Sheet!
 * 4. Strips trailing "Celebrations" from categories so "Community Meeting",
 *    "Deepavali", "Bathukamma" become clean tabs.
 * 5. Clears all script caches immediately.
 */
function syncAllFestivalFolders(force) {
  const sh = book().getSheetByName(T.gallery);
  if (!sh) {
    Logger.log('ERROR: Sheet "' + T.gallery + '" not found in spreadsheet.');
    return;
  }

  const h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const urlIdx = h.indexOf('image_url');
  const catIdx = h.indexOf('category');
  const titleIdx = h.indexOf('title');
  const altIdx = h.indexOf('alt');

  const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/mpeg', 'video/3gpp'];

  // Map of active Drive files found: fileId -> { fileId, title, category, mediaUrl, alt, isVid }
  const activeDriveFiles = new Map();
  const scannedFolderIds = new Set();

  function processFolder(folder, categoryName, defaultTitle) {
    if (!folder) return;
    let folderId = '';
    try {
      folderId = folder.getId();
    } catch (e) {
      return;
    }
    if (scannedFolderIds.has(folderId)) return;
    scannedFolderIds.add(folderId);

    const cleanCat = String(categoryName || folder.getName()).trim().replace(/\s+(Celebrations|Celebration)$/i, '').trim();
    Logger.log('Scanning folder: "' + folder.getName() + '" as category: [' + cleanCat + ']');

    try {
      const files = folder.getFiles();
      while (files.hasNext()) {
        const file = files.next();
        try {
          if (file.isTrashed()) continue; // Skip files in trash
        } catch (e) {}

        const mime = file.getMimeType();
        const fileName = file.getName();
        const isImg = IMAGE_TYPES.includes(mime) || /\.(jpe?g|png|webp|gif)$/i.test(fileName);
        const isVid = VIDEO_TYPES.includes(mime) || mime.startsWith('video/') || /\.(mp4|mov|webm|m4v|3gp|avi|mkv)$/i.test(fileName);
        if (!isImg && !isVid) continue;

        const fileId = file.getId();
        try {
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (err) {}

        const mediaUrl = isVid 
          ? ('https://drive.google.com/file/d/' + fileId + '/preview#video')
          : ('https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1400');

        const rawName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
        const title = rawName ? (rawName.charAt(0).toUpperCase() + rawName.slice(1)) : (defaultTitle + (isVid ? ' Video' : ''));

        activeDriveFiles.set(fileId, {
          fileId: fileId,
          title: title,
          category: cleanCat,
          alt: isVid ? (title + ' (Video)') : (title + ' celebration'),
          mediaUrl: mediaUrl,
          isVid: isVid
        });
      }
    } catch (err) {
      Logger.log('Error reading files in folder ' + folder.getName() + ': ' + err.message);
    }

    // Recursively scan subfolders
    try {
      const subfolders = folder.getFolders();
      while (subfolders.hasNext()) {
        const sub = subfolders.next();
        const subName = sub.getName().trim().replace(/\s+(Celebrations|Celebration)$/i, '').trim();
        processFolder(sub, subName, subName);
      }
    } catch (err) {
      Logger.log('Error reading subfolders in ' + folder.getName() + ': ' + err.message);
    }
  }

  // 1. Scan Main Festivals parent folder and all its recursive subfolders
  if (MAIN_FESTIVALS_FOLDER_ID && !MAIN_FESTIVALS_FOLDER_ID.startsWith('YOUR_')) {
    try {
      const mainFolder = DriveApp.getFolderById(MAIN_FESTIVALS_FOLDER_ID);
      Logger.log('Found Main Folder: "' + mainFolder.getName() + '"');
      processFolder(mainFolder, 'Festivals', 'Festival');
    } catch (e) {
      Logger.log('Could not scan MAIN_FESTIVALS_FOLDER_ID: ' + e.message);
    }
  }

  // 2. Scan Individual Folders (e.g. Bathukamma)
  INDIVIDUAL_FOLDERS.forEach(cfg => {
    if (!cfg.folderId) return;
    try {
      const folder = DriveApp.getFolderById(cfg.folderId);
      processFolder(folder, cfg.category, cfg.defaultTitle);
    } catch (e) {
      Logger.log('Could not scan folder ID ' + cfg.folderId + ': ' + e.message);
    }
  });

  // 3. Auto-discover standalone colony folders in Drive (e.g. "Community Meeting", "Community Meetings")
  const STANDALONE_FOLDER_NAMES = ['Community Meeting', 'Community Meetings', 'Community meeting', 'Meetings', 'Meeting'];
  STANDALONE_FOLDER_NAMES.forEach(folderName => {
    try {
      const folders = DriveApp.getFoldersByName(folderName);
      while (folders.hasNext()) {
        const f = folders.next();
        if (!scannedFolderIds.has(f.getId())) {
          Logger.log('Auto-discovered colony folder: "' + f.getName() + '"');
          processFolder(f, 'Community Meeting', 'Community Meeting');
        }
      }
    } catch (e) {
      Logger.log('Note auto-discovering ' + folderName + ': ' + e.message);
    }
  });

  Logger.log('Total active media files in Drive: ' + activeDriveFiles.size);

  // 4. Reconcile with existing rows in Gallery sheet
  const existingRows = sh.getLastRow() > 1
    ? sh.getRange(2, 1, sh.getLastRow() - 1, h.length).getValues()
    : [];

  const keptRows = [];
  const processedFileIds = new Set();
  let deletedCount = 0;

  existingRows.forEach(row => {
    const url = String(row[urlIdx] || '').trim();
    // Extract Google Drive file ID
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const driveFileId = match ? match[1] : null;

    if (driveFileId) {
      // It is a Drive file
      if (activeDriveFiles.has(driveFileId)) {
        // Photo still exists in Drive! Keep it and sync clean category
        const fileInfo = activeDriveFiles.get(driveFileId);
        row[catIdx] = fileInfo.category; // Ensure clean category without "Celebrations"
        keptRows.push(row);
        processedFileIds.add(driveFileId);
      } else {
        // Photo was DELETED or moved out of Drive folder! Drop it from sheet!
        Logger.log('Removed deleted Drive photo from Sheet: ' + (row[titleIdx] || driveFileId));
        deletedCount++;
      }
    } else {
      // Non-Drive file or manual row -> keep as-is
      if (url) keptRows.push(row);
    }
  });

  // 5. Add brand-new photos from Drive that are not yet in the sheet
  let addedCount = 0;
  activeDriveFiles.forEach((info, fileId) => {
    if (!processedFileIds.has(fileId)) {
      const rowObj = {};
      rowObj['id']        = Utilities.getUuid().slice(0, 8);
      rowObj['title']     = info.title;
      rowObj['category']  = info.category;
      rowObj['alt']       = info.alt;
      rowObj['image_url'] = info.mediaUrl;
      rowObj['status']    = 'published';

      keptRows.push(h.map(c => rowObj[c] != null ? rowObj[c] : ''));
      addedCount++;
    }
  });

  Logger.log('Reconciliation: Kept ' + keptRows.length + ' rows, Deleted ' + deletedCount + ', Added ' + addedCount);

  // 6. Write back cleanly to sheet in a single atomic batch
  if (sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
  }
  if (keptRows.length > 0) {
    sh.getRange(2, 1, keptRows.length, h.length)
      .setNumberFormat('@')
      .setValues(keptRows);
  }

  // 7. Flush cache
  try {
    CacheService.getScriptCache().removeAll(Object.keys(T).map(x => 'pub3_' + x));
    CacheService.getScriptCache().remove('last_drive_sync');
  } catch (e) {}

  Logger.log('Sync complete! Cache purged.');
  return { added: addedCount, deleted: deletedCount, total: keptRows.length };
}

function importBathukammaImages() {
  syncAllFestivalFolders();
}

/**
 * Run this function directly in Apps Script to instantly clean all existing rows
 * in your Google Sheet's Gallery tab, stripping " Celebrations" or " Celebration".
 */
function cleanAllCelebrationsFromGallerySheet() {
  const sh = book().getSheetByName(T.gallery);
  if (!sh) throw new Error('Sheet "Gallery" not found');
  const h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const catIdx = h.indexOf('category');
  if (catIdx === -1) throw new Error('Column "category" not found');

  const lastRow = sh.getLastRow();
  if (lastRow < 2) {
    Logger.log('No data rows to clean.');
    return;
  }

  const range = sh.getRange(2, catIdx + 1, lastRow - 1, 1);
  const values = range.getValues();
  let count = 0;

  for (let i = 0; i < values.length; i++) {
    const val = String(values[i][0] || '').trim();
    const cleaned = val.replace(/\s+(Celebrations|Celebration)$/i, '').trim();
    if (cleaned !== val) {
      values[i][0] = cleaned;
      count++;
    }
  }

  if (count > 0) {
    range.setValues(values);
    try { CacheService.getScriptCache().removeAll(Object.keys(T).map(x => 'pub3_' + x)); } catch (e) {}
  }
  Logger.log('Successfully cleaned "Celebrations" from ' + count + ' row(s) in Gallery sheet!');
}

/**
 * Run this function in Apps Script to automatically populate all 18 official elected committee
 * members (2025-2027) into your Google Sheet's Committee tab and clear the cache.
 */
function seedElectedCommittee() {
  const sh = book().getSheetByName(T.committee);
  if (!sh) throw new Error('Sheet "Committee" not found');

  const headers = ['id', 'name', 'designation', 'term', 'public_contact', 'photo_url', 'status'];
  
  const officialMembers = [
    // 1. President
    ['C1', 'Srikanth Bezawada', 'President', '', 'president.wsn@gmail.com', '', 'published'],
    // 2. Vice Presidents
    ['C2', 'Kiran Reddy', 'Vice President', '', '', '', 'published'],
    ['C3', 'Madhu (NFC)', 'Vice President', '', '', '', 'published'],
    ['C4', 'Venkateswarlu Kakarla', 'Vice President', '', '', '', 'published'],
    // 3. General Secretaries
    ['C5', 'Shivakumar Sandesari', 'General Secretary', '', 'sec.wsn@gmail.com', '', 'published'],
    ['C6', 'Santosh (NFC)', 'General Secretary', '', '', '', 'published'],
    // 4. Joint Secretary
    ['C7', 'Linga Naik Banoth', 'Joint Secretary', '', '', '', 'published'],
    // 5. Treasurers
    ['C8', 'Srinivasa Rao Janga', 'Treasurer', '', '', '', 'published'],
    ['C9', 'Ramesh', 'Treasurer', '', '', '', 'published'],
    // 6. Executive Members
    ['C10', 'Balaraju', 'Executive Member', '', '', '', 'published'],
    ['C11', 'Shiva (Plot No. 263)', 'Executive Member', '', '', '', 'published'],
    ['C12', 'Somanna', 'Executive Member', '', '', '', 'published'],
    ['C13', 'Srinivasulu', 'Executive Member', '', '', '', 'published'],
    ['C14', 'Sathish', 'Executive Member', '', '', '', 'published'],
    ['C15', 'Srinivasulu Janga (Army)', 'Executive Member', '', '', '', 'published'],
    // 7. Advisers
    ['C16', 'Satya Kishor', 'Adviser', '', '', '', 'published'],
    ['C17', 'Narender', 'Adviser', '', '', '', 'published'],
    ['C18', 'Vara Prasad', 'Adviser', '', '', '', 'published']
  ];

  // Reset sheet with headers and official rows
  sh.clearContents();
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.getRange(2, 1, officialMembers.length, headers.length).setValues(officialMembers);

  try {
    CacheService.getScriptCache().removeAll(Object.keys(T).map(x => 'pub3_' + x));
  } catch (e) {}

  Logger.log('Successfully seeded 18 official committee members to Committee sheet and cleared cache!');
}

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

/**
 * Auto-syncs Drive folders in background when needed so user NEVER has to manually run Apps Script.
 * Runs when cache has expired (max once every 3 minutes) or immediately when force=true.
 */
function maybeAutoSyncDrive(force) {
  const cache = CacheService.getScriptCache();
  const lastSync = cache.get('last_drive_sync');
  if (force || !lastSync) {
    try {
      syncAllFestivalFolders(force);
      cache.put('last_drive_sync', '1', 180); // 3-minute throttle for background requests
    } catch (e) {
      Logger.log('Auto-sync note: ' + e.message);
    }
  }
}

function doGet(e) {
  try {
    const a = (e && e.parameter && e.parameter.action) || 'all';
    const isSync = Boolean(
      a === 'gallery' ||
      a === 'sync' ||
      (e && e.parameter && (e.parameter.sync === '1' || e.parameter.refresh === '1' || e.parameter.force === '1'))
    );
    
    // When gallery is requested, or when page refresh / sync=1 is sent:
    // ALWAYS hit Google Drive live, remove deleted photos, add new photos, and clear cache!
    if (isSync) {
      syncAllFestivalFolders(true);
      if (a === 'gallery' || a === 'sync') {
        return out(true, 'OK', readPublic('gallery'));
      }
    }
    
    if (a === 'all') {
      const d = {};
      Object.keys(T).forEach(k => d[k] = readPublic(k));
      return out(true, 'OK', d);
    }
    
    if (T[a]) return out(true, 'OK', readPublic(a));
    return out(false, 'Unknown action');
  } catch (err) { console.error(err); return out(false, 'Unable to process the request: ' + err.message); }
}

const SUPER_ADMINS = ['varikuppalaa.sampath@gmail.com'];

function who(token) {
  if (!token) bad('Forbidden');
  const r = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(token), {muteHttpExceptions: true});
  if (r.getResponseCode() !== 200) bad('Forbidden');
  const t = JSON.parse(r.getContentText());
  if (t.aud !== CLIENT_ID || String(t.email_verified) !== 'true' || +t.exp < Date.now() / 1000) bad('Forbidden');
  
  const userEmail = String(t.email).toLowerCase().trim();
  
  // Direct check for designated super admin
  if (SUPER_ADMINS.map(e => e.toLowerCase()).includes(userEmail)) {
    return {email: t.email, role: 'admin'};
  }
  
  // Otherwise check Admins sheet tab
  const admins = readAll('Admins');
  const m = admins.find(a => String(a.email || '').toLowerCase().trim() === userEmail);
  if (!m || !['admin','editor'].includes(String(m.role || '').toLowerCase().trim())) bad('Forbidden');
  return {email: t.email, role: String(m.role).toLowerCase().trim()};
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
