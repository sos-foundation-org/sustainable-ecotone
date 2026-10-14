/**
 * Ecotone｜兼容並續: creates the two bilingual (中文 / English) Google Forms used by the website.
 *
 * 用法（只需執行一次）/ How to run (once):
 *   1. 以 sos.initiative.org@gmail.com 登入，開 https://script.google.com → 新專案 New project
 *   2. 把這整個檔案貼進去，取代原本的內容 / Paste this whole file over the default code
 *   3. 上方函式選單選 createEcotoneForms → 按「執行 Run」→ 依指示授權 / Authorise when prompted
 *   4. 兩份表單與各自的回覆試算表會出現在 My Drive/Contact；
 *      執行紀錄（Execution log）會印出兩個表單網址
 */

const FOLDER_ID = '1mHRunF6HaP1Joz195K6a3WNw9JRP9f-W'; // My Drive/Contact

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

function createEcotoneForms() {
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
