/**
 * Ecotone｜兼容並續: creates the two bilingual (中文 / English) Google Forms used by the website.
 *
 * 用法（只需執行一次）/ How to run (once):
 *   1. 以 sos.initiative.org@gmail.com 登入，開 https://script.google.com → 新專案 New project
 *   2. 把這整個檔案貼進去，取代原本的內容 / Paste this whole file over the default code
 *   3. （已執行過，函式已改名為 createEcotoneForms_ 並從執行選單隱藏，請勿再跑）
 *   4. 兩份表單與各自的回覆試算表會出現在 My Drive/Contact；
 *      執行紀錄（Execution log）會印出兩個表單網址
 *
 * ── 活動報名與通知表單 Participation form（觀眾報名 + 追蹤未來活動，合併成一份）─────────────
 *
 * 建立（只需執行一次）/ Create (once):
 *   1. 同上，在同一個 Apps Script 專案裡，函式選單選 createParticipationForm →「執行 Run」
 *   2. 表單與回覆試算表（只有一份）會出現在 My Drive/Contact
 *   3. 執行紀錄會印出：正式網址、「只想收到通知」的預填網址、每一場的預填網址、
 *      每一冊「全部場次」的預填網址
 *   4. 把這些網址貼進網站：
 *        - 每一場：src/content/events.ts → 該冊 sessions[].registerUrl
 *        - 全部場次：src/content/events.ts → 該冊 registerAllUrl
 *        - 只想收到通知：src/content/site.ts → SITE.followFormUrl（種子袋按鈕）
 *   表單 ID 會存在本專案的「指令碼屬性 Script properties」（PARTICIPATION_FORM_ID），
 *   之後 addSession() 與 logParticipationUrls() 會用到。
 *   第一題用「依答案前往的區段 Go to section based on answer」分流：
 *     報名參加活動 → 報名區段 → 聯絡資料；只想收到未來活動通知 → 直接跳到聯絡資料。
 *
 * 之後新增場次（新的一冊）/ Adding a session later:
 *   方法 A（建議）：在 addSession 的呼叫裡填新標籤，例如
 *     function run() { addSession('Vol. 02｜東華場 NDHU'); }
 *   執行後會在「報名場次」核取方塊最後加一個選項，並印出那一場的預填網址。
 *   方法 B：在 Google 表單介面手動於「報名場次 Sessions」加選項（文字要和網站 formLabel 一字不差），
 *     再用表單右上角 ⋮ →「取得預先填入的連結 Get pre-filled link」產生網址；
 *     或執行 logParticipationUrls() 重新印出所有網址。
 *   不論哪種方法，最後都要：
 *     - 同時把標籤加進下方 SESSIONS（讓這份腳本與表單保持一致）
 *     - 在 src/content/events.ts 該冊的 sessions 加一筆，formLabel 與表單選項一字不差，
 *       registerUrl 貼上預填網址；有多場時，registerAllUrl 貼上該冊「全部場次」的網址
 */

const FOLDER_ID = '1mHRunF6HaP1Joz195K6a3WNw9JRP9f-W'; // My Drive/Contact

/**
 * 報名場次的選項文字 Session labels（= 回覆試算表裡的值，也 = 網站 events.ts 的 formLabel）。
 *
 * ⚠ 上線後絕對不要修改既有的標籤：改了之後，舊回覆與新回覆會變成兩個不同的值，
 *   網站上的預填網址也會失效（勾不到選項）。日期、時間、教室等會變的資訊不放在標籤裡。
 *   Never edit a label once the form is live. Dates, times and rooms stay out of the label.
 * 新的一冊：在最後面「新增」標籤（格式 `Vol. NN｜場名 Short name`），不要改舊的。
 *   For a new volume, append new labels; never rename or reorder the old ones.
 */
const SESSIONS = [
  'Vol. 01｜臺大場 NTU',
  'Vol. 01｜陽明交大場 NYCU',
];

const PARTICIPATION_FORM_ID_KEY = 'PARTICIPATION_FORM_ID';
const P_TITLES = {
  intent: '你想要？ What would you like to do?',
  register: '報名參加活動 Register for a session',
  follow: '只想收到未來活動通知 Just notify me about future events',
  sessions: '報名場次 Sessions',
};

const DISCIPLINES = [
  '生態／環境科學 Ecology & Environmental Science',
  '氣候科學 Climate Science',
  '生命科學 Life Sciences',
  '醫學／公共衛生 Medicine & Public Health',
  '農業 Agriculture',
  '漁業／海洋 Fisheries & Ocean',
  '電機／資訊 Electrical Engineering & Computing',
  '高科技產業 High-tech Industry',
  '機械／工程 Mechanical Engineering',
  '設計／建築／地景 Design, Architecture & Landscape',
  '文學 Literature',
  '歷史 History',
  '藝術 Arts',
  '教育 Education',
  '金融／經濟 Finance & Economics',
  '法律 Law',
  '政治／公共政策 Politics & Public Policy',
  '社會科學 Social Sciences',
];

/** 永續與自然議題 Sustainability & nature themes */
const SUSTAINABILITY = [
  '氣候變遷 Climate change',
  '生物多樣性 Biodiversity',
  '海洋與水資源 Oceans & water',
  '糧食與農業 Food & agriculture',
  '能源與減碳 Energy & decarbonisation',
  '循環經濟 Circular economy',
  '永續城市與地景 Sustainable cities & landscapes',
  '健康與環境 Health & environment',
  '永續金融與治理 Sustainable finance & governance',
  '環境正義與社會 Environmental justice & society',
  '永續教育與文化 Education, arts & culture for sustainability',
  '自然觀察與博物學 Natural history & nature observation',
  '動植物與生態系 Wildlife, plants & ecosystems',
  '自然啟發的設計與科技 Nature-inspired design & technology',
];

/**
 * 已執行過（2026-10-15），不要再跑：結尾的底線讓它不會出現在 Apps Script 的「執行」函式選單裡，
 * 避免誤觸又建一套重複的講者表單與舊追蹤表單。
 * Already run once; the trailing underscore hides it from the Run menu so it can't be re-run by accident.
 */
function createEcotoneForms_() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const speaker = createSpeakerForm_(folder);
  const follow = createFollowForm_(folder);
  Logger.log('講者招募表單 Call for Speakers: ' + speaker);
  Logger.log('追蹤未來活動表單 Stay in the loop: ' + follow);
}

function emailItem_(form) {
  return form.addTextItem()
    .setTitle('Email')
    .setRequired(true)
    .setValidation(
      FormApp.createTextValidation()
        .requireTextIsEmail()
        .setHelpText('請輸入有效的 email / Please enter a valid email address')
        .build()
    );
}

function finish_(form, folder, sheetName) {
  const ss = SpreadsheetApp.create(sheetName);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  DriveApp.getFileById(form.getId()).moveTo(folder);
  DriveApp.getFileById(ss.getId()).moveTo(folder);
  return form.getPublishedUrl();
}

function createSpeakerForm_(folder) {
  const form = FormApp.create('Ecotone｜兼容並續 — 講者招募 Call for Speakers');
  form.setDescription(
    'Ecotone｜兼容並續是由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起的跨領域永續論壇。\n' +
    '我們在找「本身就是一個 ecotone」的人：同時活在好幾個領域、好幾個身份、甚至好幾個國家之間，' +
    '而且你的工作與「永續」或「自然」有實質的連結。如果你有一個只有站在交界處才看得到的觀點，歡迎留下資料，' +
    '未來的系列講座我們會主動與你聯繫。填寫約 5 分鐘。\n\n' +
    'Ecotone is an interdisciplinary sustainability forum co-founded by National Taiwan University, ' +
    'National Yang Ming Chiao Tung University and SOS Foundation. We are looking for people who are ' +
    'themselves an ecotone: living across several fields, identities, or even countries, and whose work ' +
    'is genuinely connected to sustainability or the natural world. If you see something that is only ' +
    'visible from the edge between disciplines, leave us your details and we will reach out when ' +
    'planning future talks. Takes about 5 minutes.'
  );
  form.setConfirmationMessage(
    '謝謝你！我們收到了。規劃下一場活動時，會優先與合適的講者聯繫。\n' +
    'Thank you! We have received your submission and will be in touch when planning upcoming events.'
  );
  form.setAllowResponseEdits(true);

  form.addSectionHeaderItem().setTitle('關於你 About you');
  form.addTextItem().setTitle('姓名 Name').setRequired(true);
  emailItem_(form);
  form.addTextItem().setTitle('目前所在的國家／城市 Country / city you are based in').setRequired(true);
  form.addParagraphTextItem()
    .setTitle('你的身份（可以很多個）Your identities (as many as you like)')
    .setHelpText(
      '例如：海洋生物學家／潛水教練／詩人。職稱、機構、或任何你認為定義你的角色都可以。\n' +
      'e.g. marine biologist / dive instructor / poet. Job titles, institutions, or any role that defines you.'
    )
    .setRequired(true);
  form.addCheckboxItem()
    .setTitle('你跨越的領域 Fields you work across')
    .setChoiceValues(DISCIPLINES)
    .showOtherOption(true)
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('你與永續／自然 You, sustainability & nature')
    .setHelpText(
      'Ecotone 的講者除了跨領域，也必須與永續或自然有實質的關係。\n' +
      'Besides working across disciplines, every Ecotone speaker has a real connection to sustainability or the natural world.'
    );
  form.addCheckboxItem()
    .setTitle('你的工作與哪些永續或自然議題相關？Which sustainability or nature themes does your work touch?')
    .setChoiceValues(SUSTAINABILITY)
    .showOtherOption(true)
    .setRequired(true);
  form.addParagraphTextItem()
    .setTitle('你的工作如何與永續或自然連結？How is your work connected to sustainability or nature?')
    .setHelpText(
      '請具體描述：研究、實踐、產品、政策、創作或教學都可以。\n' +
      'Please be specific: research, practice, products, policy, creative work or teaching all count.'
    )
    .setRequired(true);

  form.addSectionHeaderItem().setTitle('你想帶來的講題 Your talk');
  form.addTextItem().setTitle('講題（暫定）Working title').setRequired(true);
  form.addParagraphTextItem()
    .setTitle('你想讓哪些領域在這場演講中相遇？Which worlds meet in your talk?')
    .setHelpText(
      '用幾句話描述你的觀點，以及它為什麼只有在學科的交界處才看得到。\n' +
      'In a few sentences, describe your perspective and why it is only visible where disciplines meet.'
    )
    .setRequired(true);
  form.addCheckboxItem()
    .setTitle('可使用的演講語言 Languages you can present in')
    .setChoiceValues(['中文 Mandarin Chinese', 'English'])
    .showOtherOption(true)
    .setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle('參與形式 Format')
    .setChoiceValues([
      '可到臺灣現場 In person in Taiwan',
      '線上／預錄影片 Online / pre-recorded video',
      '兩者皆可 Either',
    ])
    .setRequired(true);
  form.addParagraphTextItem()
    .setTitle('相關連結 Links')
    .setHelpText(
      '個人網站、作品、LinkedIn、過去的演講影片等（選填）\n' +
      'Website, portfolio, LinkedIn, past talk videos, etc. (optional)'
    );
  form.addParagraphTextItem().setTitle('還想告訴我們的事 Anything else?');

  form.addCheckboxItem()
    .setTitle('聯絡同意 Consent')
    .setChoiceValues([
      '我同意 Ecotone｜兼容並續 主辦單位使用以上資料與我聯繫講座邀約 / ' +
      'I agree that the Ecotone organisers may use these details to contact me about speaking',
    ])
    .setRequired(true);

  return finish_(form, folder, 'Ecotone 講者招募 Call for Speakers (Responses)');
}

function createFollowForm_(folder) {
  const form = FormApp.create('Ecotone｜兼容並續 — 追蹤未來活動 Stay in the loop');
  form.setDescription(
    '留下你的 email，Ecotone｜兼容並續有新的系列講座時，你會第一時間收到通知。\n' +
    '我們只在有活動消息時寫信給你，不會轉交給任何第三方。\n\n' +
    'Leave your email and be the first to hear when Ecotone announces a new talk series.\n' +
    'We only write when there is event news, and never share your details with third parties.'
  );
  form.setConfirmationMessage(
    '訂閱成功。下一次潮水漲起時，我們會通知你。\n' +
    'You are on the list. We will let you know when the next tide comes in.'
  );

  emailItem_(form);
  form.addTextItem().setTitle('怎麼稱呼你？（選填）What should we call you? (optional)');
  form.addCheckboxItem()
    .setTitle('你對哪些領域特別有興趣？（選填）Fields you are most curious about (optional)')
    .setChoiceValues(DISCIPLINES)
    .showOtherOption(true);
  form.addCheckboxItem()
    .setTitle('你關心哪些永續或自然議題？（選填）Sustainability & nature themes you care about (optional)')
    .setChoiceValues(SUSTAINABILITY)
    .showOtherOption(true);
  form.addMultipleChoiceItem()
    .setTitle('你從哪裡知道 Ecotone？（選填）How did you hear about Ecotone? (optional)')
    .setChoiceValues([
      '朋友介紹 A friend',
      '社群媒體 Social media',
      '學校／系所公告 University / department announcement',
      'SOS Foundation',
      '活動現場 At an event',
    ])
    .showOtherOption(true);
  form.addCheckboxItem()
    .setTitle('訂閱同意 Consent')
    .setChoiceValues([
      '我同意接收 Ecotone｜兼容並續 的活動通知，並可隨時來信取消 / ' +
      'I agree to receive Ecotone event updates and can unsubscribe at any time',
    ])
    .setRequired(true);

  return finish_(form, folder, 'Ecotone 追蹤未來活動 Stay in the loop (Responses)');
}

// ─── 活動報名與通知 Participation form ─────────────────────────────────────────
// 一份表單、一份回覆試算表：觀眾報名各場次，以及只想收到未來活動通知的人。
// One form, one response sheet: audience registration per session, plus "just notify me".

function createParticipationForm() {
  // guard: only ever create this form once; afterwards use addSession() / logParticipationUrls()
  const existing = PropertiesService.getScriptProperties().getProperty(PARTICIPATION_FORM_ID_KEY);
  if (existing) {
    Logger.log('活動報名與通知表單已經建立過（ID: ' + existing + '），這次不會再建立。要重新印出網址，請改執行 logParticipationUrls。');
    Logger.log('The participation form already exists (ID: ' + existing + '). Run logParticipationUrls to print its URLs again.');
    return;
  }
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const form = FormApp.create('Ecotone｜兼容並續 活動報名與通知 Register & Stay in the loop');
  form.setDescription(
    '報名 Ecotone｜兼容並續 的場次，或只留下聯絡方式，在新的活動公布時收到通知。填寫約 1 分鐘。\n' +
    '要來現場的朋友，請務必填寫報名表。若時間、地點有任何異動，我們只會通知已報名的朋友，以免你錯過，或白跑一趟。\n' +
    '我們只用這些資料處理報名與寄送活動消息，不會轉交給任何第三方。\n\n' +
    'Register for an Ecotone session, or just leave your details to hear when new events are announced. Takes about 1 minute.\n' +
    'Planning to come? Please register. If the time or venue changes, we will only be able to tell those who signed up, ' +
    'so you don\'t miss it or make a wasted trip.\n' +
    'We only use these details for registration and event news, and never share them with third parties.'
  );
  form.setConfirmationMessage(
    '謝謝你！我們收到了。報名的場次若有任何異動，我們會寫信通知你；有新的活動時，也會讓你知道。\n' +
    'Thank you! We have received your response. If anything changes for your session we will email you, ' +
    'and we will let you know when new events are announced.'
  );
  form.setAllowResponseEdits(true);

  // Section 1: what would you like to do? (navigation is set once the later sections exist)
  const intent = form.addMultipleChoiceItem()
    .setTitle(P_TITLES.intent)
    .setRequired(true);

  // Section 2: registration
  const regPage = form.addPageBreakItem()
    .setTitle('報名 Registration')
    .setHelpText(
      '可以勾選多個場次。日期、時間與教室確認後，會公布在網站上，並寫信通知已報名的朋友。\n' +
      'You can tick more than one session. Dates, times and rooms will be posted on the website once confirmed, ' +
      'and we will email everyone who has registered.'
    );
  const sessions = form.addCheckboxItem()
    .setTitle(P_TITLES.sessions)
    .setChoiceValues(SESSIONS)
    .setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle('身份 You are')
    .setChoiceValues([
      '學生 Student',
      '教職員 Faculty & staff',
      '業界 Industry',
      '一般民眾 Member of the public',
    ])
    .showOtherOption(true)
    .setRequired(true);
  form.addTextItem()
    .setTitle('所屬單位（選填）Affiliation (optional)')
    .setHelpText('學校、系所、公司或團體 / School, department, company or organisation');
  form.addCheckboxItem()
    .setTitle('也通知我未來的活動 Also notify me about future events')
    .setChoiceValues(['好，也通知我未來的活動 Yes, also tell me about future events']);
  // the end of this section simply continues to the next one (Contact)

  // Section 3: contact (everyone ends here)
  const contactPage = form.addPageBreakItem()
    .setTitle('聯絡資料 Contact details')
    .setHelpText(
      '我們只會用這些資料寄送報名確認、場次異動與活動消息。\n' +
      'We will only use these details for registration, session updates and event news.'
    );
  form.addTextItem().setTitle('姓名 Name').setRequired(true);
  emailItem_(form);
  form.addCheckboxItem()
    .setTitle('同意 Consent')
    .setChoiceValues([
      '我同意 Ecotone｜兼容並續 主辦單位使用以上資料處理報名，並寄送場次異動與活動通知；可隨時來信取消 / ' +
      'I agree that the Ecotone organisers may use these details for registration, session updates ' +
      'and event news, and that I can unsubscribe at any time',
    ])
    .setRequired(true);

  intent.setChoices([
    intent.createChoice(P_TITLES.register, regPage),
    intent.createChoice(P_TITLES.follow, contactPage),
  ]);

  const url = finish_(form, folder, 'Ecotone 活動報名與通知 Register & Stay in the loop (Responses)');
  PropertiesService.getScriptProperties().setProperty(PARTICIPATION_FORM_ID_KEY, form.getId());
  Logger.log('活動報名與通知表單 Participation form: ' + url);
  logParticipationUrls_(form);
}

/** 重新印出所有網址 / Re-log every URL (base, follow-only, each session, all sessions per volume). */
function logParticipationUrls() {
  logParticipationUrls_(openParticipationForm_());
}

/**
 * 新增一個場次：在「報名場次」最後加一個選項，並印出它的預填網址。
 * Appends a session option to the live form and logs its pre-filled URL.
 * 也請把同一個標籤加進上方 SESSIONS，並在網站 events.ts 加一筆 session。
 */
function addSession(label) {
  if (!label) throw new Error('請提供場次標籤，例如 addSession(\'Vol. 02｜東華場 NDHU\')');
  const form = openParticipationForm_();
  const cb = participationItems_(form).sessions;
  const values = cb.getChoices().map(function (c) { return c.getValue(); });
  if (values.indexOf(label) === -1) {
    cb.setChoiceValues(values.concat([label]));
    Logger.log('已新增場次 Added session: ' + label);
  } else {
    Logger.log('場次已存在 Session already exists: ' + label);
  }
  Logger.log(label + ' → ' + registerUrl_(form, [label]));
}

function openParticipationForm_() {
  const id = PropertiesService.getScriptProperties().getProperty(PARTICIPATION_FORM_ID_KEY);
  if (!id) throw new Error('找不到表單 ID：請先執行 createParticipationForm() / Run createParticipationForm() first.');
  return FormApp.openById(id);
}

function participationItems_(form) {
  const find = function (type, title) {
    const item = form.getItems(type).filter(function (i) { return i.getTitle() === title; })[0];
    if (!item) throw new Error('表單裡找不到題目 Missing item: ' + title);
    return item;
  };
  return {
    intent: find(FormApp.ItemType.MULTIPLE_CHOICE, P_TITLES.intent).asMultipleChoiceItem(),
    sessions: find(FormApp.ItemType.CHECKBOX, P_TITLES.sessions).asCheckboxItem(),
  };
}

/** 預填網址：第一題選「報名」，並勾好指定場次 / Pre-filled URL: register, with these sessions ticked. */
function registerUrl_(form, labels) {
  const it = participationItems_(form);
  return form.createResponse()
    .withItemResponse(it.intent.createResponse(P_TITLES.register))
    .withItemResponse(it.sessions.createResponse(labels))
    .toPrefilledUrl();
}

function logParticipationUrls_(form) {
  const it = participationItems_(form);
  const labels = it.sessions.getChoices().map(function (c) { return c.getValue(); });

  Logger.log('正式網址 Published URL: ' + form.getPublishedUrl());
  Logger.log(
    '只想收到通知 Follow only → SITE.followFormUrl: ' +
    form.createResponse().withItemResponse(it.intent.createResponse(P_TITLES.follow)).toPrefilledUrl()
  );

  labels.forEach(function (label) {
    Logger.log('場次 Session ' + label + ' → registerUrl: ' + registerUrl_(form, [label]));
  });

  // 每一冊「全部場次」/ all sessions of each volume (only when a volume has more than one)
  const byVol = {};
  labels.forEach(function (label) {
    const vol = label.split('｜')[0];
    (byVol[vol] = byVol[vol] || []).push(label);
  });
  Object.keys(byVol).forEach(function (vol) {
    if (byVol[vol].length > 1) {
      Logger.log('全部場次 All sessions of ' + vol + ' → registerAllUrl: ' + registerUrl_(form, byVol[vol]));
    }
  });
}
