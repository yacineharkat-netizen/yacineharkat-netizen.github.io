// content.js - BACKUP COPY of the content of the page.
// Since ClassPulse v27 the page is edited on the page itself: open the page with ?edit at the end of its address,
// sign in with the ClassPulse account, change the texts, Save. The content is then kept in the ClassPulse database.
// This file is only shown when the database does not answer. To refresh it: edit mode > "Download backup copy",
// then replace this file in the repository (Commit + Push).
// Each text exists in three languages: en (default), ar, fr. A missing translation falls back to English.

window.SITE = {
  slug: "yacine-harkat",       // name of this page in the ClassPulse database (do not change)
  name: { en: "Dr Yacine Harkat", ar: "د. ياسين حركات", fr: "Dr Yacine Harkat" },
  title: { en: "Associate Professor · Researcher", ar: "أستاذ محاضر · باحث", fr: "Maître de conférences · Chercheur" },
  affiliation: {
    en: "Telecommunications Department · Faculty of Electrical Engineering · USTHB, Algiers",
    ar: "قسم الاتصالات · كلية الهندسة الكهربائية · جامعة هواري بومدين للعلوم والتكنولوجيا، الجزائر",
    fr: "Département de Télécommunications · Faculté de Génie Électrique · USTHB, Alger",
  },
  tagline: {
    en: "IoT, edge computing and industrial cybersecurity: systems that work, from the sensor to the cloud.",
    ar: "إنترنت الأشياء والحوسبة الطرفية والأمن السيبراني الصناعي: أنظمة تعمل فعلًا، من المستشعر إلى السحابة.",
    fr: "IoT, edge computing et cybersécurité industrielle : des systèmes qui fonctionnent, du capteur au cloud.",
  },
  photo: "photo.jpg",          // put photo.jpg next to index.html (square, about 600 x 600). Empty = initials.
  initials: "YH",
  email: "yacine.harkat@gmail.com",
  office: { en: "Lab 101, Faculty of Electrical Engineering", ar: "المخبر 101، كلية الهندسة الكهربائية", fr: "Labo 101, Faculté de Génie Électrique" },
  hours: [],                   // office hours, e.g. { en: "Tuesday 10:00-12:00", ar: "...", fr: "Mardi 10:00-12:00" } (also shown in ClassPulse)
  links: [                      // shown as small buttons under the photo; remove the ones you do not want
    { label: "Google Scholar", url: "" },   // TODO: paste the address of your Scholar profile (empty = hidden)
    { label: "ORCID", url: "" },            // TODO: https://orcid.org/0000-....
    { label: "ResearchGate", url: "https://www.researchgate.net/profile/Yacine-Harkat" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/yacine-harkat-79625aa4/" },
  ],
  classpulse: "classpulse/",   // ClassPulse is next to this page

  // ------------------------------------------------------------------ tabs (order = order on the page)
  tabs: [
    {
      id: "about", icon: "◉",
      label: { en: "Biography", ar: "السيرة", fr: "Biographie" },
      blocks: [
        { type: "text",
          text: {
            en: "Yacine Harkat is an associate professor in the Telecommunications Department of the Faculty of Electrical Engineering at USTHB, Algiers. Before joining the university, he spent nearly seven years as a permanent researcher at the Centre for Development of Advanced Technologies (CDTA) and nearly two years at the Research Centre on Scientific and Technical Information (CERIST). His research combines performance modelling of wireless and vehicular networks with the design of embedded and IoT systems, and extends to the security of industrial systems, anomaly detection and federated learning. He teaches the Internet of Things, edge and cloud computing, and networks and protocols in the engineering and master programmes.",
            ar: "ياسين حركات أستاذ محاضر بقسم الاتصالات في كلية الهندسة الكهربائية بجامعة هواري بومدين للعلوم والتكنولوجيا بالجزائر. قبل التحاقه بالجامعة، عمل قرابة سبع سنوات باحثًا دائمًا في مركز تنمية التكنولوجيات المتطورة (CDTA) وقرابة سنتين في مركز البحث في الإعلام العلمي والتقني (CERIST). تجمع أبحاثه بين نمذجة أداء الشبكات اللاسلكية وشبكات المركبات وتصميم الأنظمة المدمجة وإنترنت الأشياء، وتمتد إلى أمن الأنظمة الصناعية وكشف الشذوذ والتعلم الفيدرالي. يدرّس إنترنت الأشياء والحوسبة الطرفية والسحابية والشبكات والبروتوكولات في طوري الهندسة والماستر.",
            fr: "Yacine Harkat est maître de conférences au Département de Télécommunications de la Faculté de Génie Électrique de l'USTHB, à Alger. Avant de rejoindre l'université, il a été près de sept ans chercheur permanent au Centre de Développement des Technologies Avancées (CDTA) et près de deux ans au Centre de Recherche sur l'Information Scientifique et Technique (CERIST). Ses recherches associent la modélisation des performances des réseaux sans fil et véhiculaires à la conception de systèmes embarqués et IoT, et s'étendent à la sécurité des systèmes industriels, à la détection d'anomalies et à l'apprentissage fédéré. Il enseigne l'Internet des objets, l'edge et le cloud computing, et les réseaux et protocoles dans les cycles ingénieur et master.",
          } },
        { type: "facts", items: [
          { k: { en: "Now", ar: "حاليًا", fr: "Actuellement" }, v: { en: "USTHB, Telecommunications Department", ar: "جامعة هواري بومدين، قسم الاتصالات", fr: "USTHB, Département de Télécommunications" } },
          { k: { en: "Before", ar: "سابقًا", fr: "Auparavant" }, v: { en: "CDTA (≈ 7 years) · CERIST (≈ 2 years)", ar: "CDTA (≈ 7 سنوات) · CERIST (≈ سنتان)", fr: "CDTA (≈ 7 ans) · CERIST (≈ 2 ans)" } },
          { k: { en: "Languages", ar: "اللغات", fr: "Langues" }, v: { en: "Arabic, French, English", ar: "العربية، الفرنسية، الإنجليزية", fr: "Arabe, français, anglais" } },
        ] },
      ],
    },
    {
      id: "research", icon: "◆",
      label: { en: "Research", ar: "البحث", fr: "Recherche" },
      blocks: [
        { type: "cards", items: [
          { t: { en: "Wireless and vehicular networks", ar: "الشبكات اللاسلكية وشبكات المركبات", fr: "Réseaux sans fil et véhiculaires" },
            d: { en: "Performance models of IEEE 802.11p / EDCA access, C-V2X, quality of service.", ar: "نماذج أداء النفاذ IEEE 802.11p / EDCA، وC-V2X، وجودة الخدمة.", fr: "Modèles de performance de l'accès IEEE 802.11p / EDCA, C-V2X, qualité de service." } },
          { t: { en: "Intelligent transport", ar: "النقل الذكي", fr: "Transport intelligent" },
            d: { en: "Reinforcement learning for traffic signals, emergency vehicles and urban logistics.", ar: "التعلم المعزز لإشارات المرور ومركبات الطوارئ واللوجستيك الحضري.", fr: "Apprentissage par renforcement pour les feux, les véhicules d'urgence et la logistique urbaine." } },
          { t: { en: "Industrial cybersecurity", ar: "الأمن السيبراني الصناعي", fr: "Cybersécurité industrielle" },
            d: { en: "Intrusion and anomaly detection for industrial IoT networks.", ar: "كشف التسلل والشذوذ في شبكات إنترنت الأشياء الصناعي.", fr: "Détection d'intrusions et d'anomalies dans les réseaux IoT industriels." } },
          { t: { en: "Federated learning, edge and IoT", ar: "التعلم الفيدرالي والحوسبة الطرفية وإنترنت الأشياء", fr: "Apprentissage fédéré, edge et IoT" },
            d: { en: "Learning across sites without moving raw data; embedded and edge processing.", ar: "التعلم عبر عدة مواقع دون نقل البيانات الخام؛ المعالجة المدمجة والطرفية.", fr: "Apprendre sur plusieurs sites sans déplacer les données ; traitement embarqué et en bordure." } },
        ] },
        { type: "list", title: { en: "Selected publications", ar: "منشورات مختارة", fr: "Publications choisies" }, items: [
          "TAWJEEH: an integrated deep reinforcement learning and heuristic framework for C-V2X enabled real-time multidepot vehicle routing optimization in urban logistics. Transportation Research Record, 2026.",
          "Multi-policy vs. shared policy architectures in multi-agent proximal policy optimization for heterogeneous traffic signal control. Conference paper, 2026.",
          "Real-time emergency vehicles priority management system in a connected urban environment. Conference paper, 2024.",
          "Design and implementation of an error-margin aware approach for non-uniform segmentation of elementary functions using degree-N polynomial approximation. IEEJ Transactions on Electrical and Electronic Engineering, 2023.",
          "Modeling and performance analysis of the IEEE 802.11p EDCA mechanism for VANET under saturation traffic conditions and error-prone channel. AEU – International Journal of Electronics and Communications, 2019.",
        ] },
      ],
    },
    {
      id: "teaching", icon: "▲",
      label: { en: "Teaching", ar: "التدريس", fr: "Enseignement" },
      blocks: [
        { type: "cards", items: [
          { t: { en: "Internet of Things", ar: "إنترنت الأشياء", fr: "Internet des objets" },
            d: { en: "Master in Networks and Telecommunications · 4th-year engineering", ar: "ماستر الشبكات والاتصالات · السنة الرابعة هندسة", fr: "Master Réseaux et Télécommunications · 4e année ingénieur" } },
          { t: { en: "Edge & Cloud Computing", ar: "الحوسبة الطرفية والسحابية", fr: "Edge & Cloud Computing" },
            d: { en: "5th-year engineering", ar: "السنة الخامسة هندسة", fr: "5e année ingénieur" } },
          { t: { en: "Networks and Protocols", ar: "الشبكات والبروتوكولات", fr: "Réseaux et protocoles" },
            d: { en: "Engineering cycle", ar: "الطور الهندسي", fr: "Cycle ingénieur" } },
        ] },
        { type: "text", text: {
          en: "Labs on real hardware (ESP32, Raspberry Pi, containers), a live demonstration in every lecture, quizzes and attendance in ClassPulse.",
          ar: "أعمال تطبيقية على عتاد حقيقي (ESP32، Raspberry Pi، الحاويات)، عرض حي في كل محاضرة، واختبارات وحضور عبر ClassPulse.",
          fr: "Travaux pratiques sur du vrai matériel (ESP32, Raspberry Pi, conteneurs), une démonstration en direct à chaque cours, quiz et présence dans ClassPulse." } },
        { type: "button", label: { en: "Students: open ClassPulse", ar: "الطلبة: الدخول إلى ClassPulse", fr: "Étudiants : ouvrir ClassPulse" }, url: "@classpulse" },
      ],
    },
    {
      id: "supervision", icon: "●",
      label: { en: "Supervision", ar: "التأطير", fr: "Encadrement" },
      blocks: [
        { type: "text", text: {
          en: "Final-year engineering projects and master theses in IoT, edge computing and network security. Current proposals and office hours are kept up to date in ClassPulse.",
          ar: "مشاريع نهاية الدراسة في الهندسة ومذكرات الماستر في إنترنت الأشياء والحوسبة الطرفية وأمن الشبكات. المقترحات الحالية ومواعيد الاستقبال محدّثة في ClassPulse.",
          fr: "Projets de fin d'études d'ingénieur et mémoires de master en IoT, edge computing et sécurité des réseaux. Les propositions en cours et les créneaux de réception sont tenus à jour dans ClassPulse." } },
        // proposals: shown here and in the teacher space of ClassPulse, where students can say they are interested
        { type: "offers", kind: "supervision", title: { en: "Current proposals", ar: "المقترحات الحالية", fr: "Propositions en cours" }, items: [] },
        { type: "button", label: { en: "Interested? Write to me from ClassPulse", ar: "مهتم؟ راسلني عبر ClassPulse", fr: "Intéressé ? Écrivez-moi depuis ClassPulse" }, url: "@classpulse-teacher" },
      ],
    },
    {
      id: "projects", icon: "■",
      label: { en: "Projects", ar: "المشاريع", fr: "Projets" },
      blocks: [
        { type: "cards", items: [
          { t: { en: "ClassPulse", ar: "ClassPulse", fr: "ClassPulse" },
            d: { en: "Attendance, live quizzes and course documents for large classes, on the students' phones.", ar: "الحضور والاختبارات الحية ووثائق المقاييس للأفواج الكبيرة، على هواتف الطلبة.", fr: "Présence, quiz en direct et documents de cours pour les grands effectifs, sur le téléphone des étudiants." } },
          { t: { en: "Teaching data-center platform", ar: "منصة مركز بيانات تعليمي", fr: "Plateforme de mini data center pédagogique" },
            d: { en: "Managing servers, storage and virtual machines for lab work.", ar: "تسيير الخوادم والتخزين والآلات الافتراضية للأعمال التطبيقية.", fr: "Gestion des serveurs, du stockage et des machines virtuelles pour les TP." } },
          { t: { en: "Mini-projects for students", ar: "مشاريع صغيرة للطلبة", fr: "Mini-projets pour les étudiants" },
            d: { en: "Open hands-on projects outside the courses: see ClassPulse.", ar: "مشاريع تطبيقية مفتوحة خارج المقاييس: انظر ClassPulse.", fr: "Projets pratiques ouverts hors des cours : voir ClassPulse." } },
        ] },
        { type: "offers", kind: "miniproject", title: { en: "Mini-projects open to students", ar: "مشاريع صغيرة مفتوحة للطلبة", fr: "Mini-projets ouverts aux étudiants" }, items: [] },
      ],
    },
    {
      id: "service", icon: "◇",
      label: { en: "Service", ar: "المهام", fr: "Fonctions" },
      blocks: [
        { type: "list", items: [
          { en: "Head of the 3rd year of the engineering programme (ATT), Telecommunications Department", ar: "مسؤول السنة الثالثة هندسة (ATT)، قسم الاتصالات", fr: "Responsable de la 3e année ingénieur ATT, Département de Télécommunications" },
        ] },
      ],
    },
    {
      id: "more", icon: "✦",
      label: { en: "More", ar: "متفرقات", fr: "Divers" },
      blocks: [
        { type: "list", title: { en: "Training and workshops", ar: "التكوين والورشات", fr: "Formations et ateliers" }, items: [
          { en: "IoT for life sciences: one-day workshop for PhD students in biology (ESP32 sensors, embedded AI)", ar: "إنترنت الأشياء لعلوم الحياة: ورشة ليوم واحد لطلبة الدكتوراه في البيولوجيا (مستشعرات ESP32، الذكاء الاصطناعي المدمج)", fr: "IoT pour les sciences du vivant : journée de formation pour doctorants en biologie (capteurs ESP32, IA embarquée)" },
        ] },
      ],
    },
  ],
};
