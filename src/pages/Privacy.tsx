import { Layout } from "@/components/layout/Layout";
import { useI18n } from "@/i18n/I18nProvider";

const Privacy = () => {
  const { t, lang } = useI18n();
  const en = [
    ["1. Information We Collect", "We collect account information (name, email, phone), order and shipping details, and usage data such as device, browser, and IP address."],
    ["2. How We Use Information", "To process orders, deliver products, provide customer support, send transactional and marketing communications (you can opt out anytime), and improve our services."],
    ["3. Sharing", "We share data with trusted processors (payments, shipping, analytics) under contractual safeguards. We never sell personal information."],
    ["4. Cookies", "We use essential cookies for authentication and cart functionality, and optional cookies for analytics and personalization. You can control cookies in your browser."],
    ["5. Data Retention", "We retain personal data only as long as needed to provide services and meet legal obligations, then securely delete or anonymize it."],
    ["6. Your Rights", "You may access, correct, export, or delete your personal data at any time from your account or by emailing privacy@voltride.com."],
    ["7. Security", "We employ encryption in transit and at rest, role-based access controls, and regular audits to protect your information."],
    ["8. Children", "Voltride is not directed to children under 16 and we do not knowingly collect their data."],
    ["9. Changes", "We will post updates to this policy on this page and notify you of material changes."],
    ["10. Contact", "For privacy questions, contact privacy@voltride.com."],
  ];
  const he = [
    ["1. המידע שאנו אוספים", "אנו אוספים פרטי חשבון (שם, אימייל, טלפון), פרטי הזמנה ומשלוח, ונתוני שימוש כגון מכשיר, דפדפן וכתובת IP."],
    ["2. כיצד אנו משתמשים במידע", "לעיבוד הזמנות, אספקה, שירות לקוחות, שליחת הודעות שיווק ושירות (ניתן להסיר הרשמה), ולשיפור השירות."],
    ["3. שיתוף מידע", "אנו משתפים מידע עם ספקי שירות מהימנים (תשלומים, משלוחים, אנליטיקה) תחת התחייבות חוזית. איננו מוכרים מידע אישי."],
    ["4. עוגיות", "אנו משתמשים בעוגיות חיוניות להתחברות ולעגלה, ובעוגיות אופציונליות לאנליטיקה והתאמה אישית. ניתן לנהל בדפדפן."],
    ["5. שמירת מידע", "אנו שומרים מידע אישי רק כל עוד נדרש לספק את השירות ולעמוד בחובות חוקיות, ואז מוחקים אותו או הופכים אותו אנונימי."],
    ["6. הזכויות שלך", "ניתן לגשת, לתקן, לייצא או למחוק את המידע האישי שלך בכל עת מהחשבון או באמצעות פנייה לאימייל privacy@voltride.com."],
    ["7. אבטחה", "אנו משתמשים בהצפנה במעבר ובמנוחה, בבקרות גישה מבוססות תפקיד, ובביקורות סדירות."],
    ["8. ילדים", "השירות אינו מיועד לילדים מתחת לגיל 16 ואיננו אוספים את נתוניהם ביודעין."],
    ["9. שינויים", "נפרסם עדכונים למדיניות זו ונודיע על שינויים מהותיים."],
    ["10. יצירת קשר", "לשאלות בנושא פרטיות, יש לפנות ל-privacy@voltride.com."],
  ];
  const items = lang === "he" ? he : en;

  return (
    <Layout>
      <section className="container-px mx-auto max-w-3xl py-16">
        <h1 className="font-display text-4xl lg:text-5xl font-bold">{t("legal.privacyTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-2">{t("legal.updated")}</p>
        <div className="mt-10 space-y-8">
          {items.map(([h, p]) => (
            <div key={h}>
              <h2 className="font-display text-xl font-semibold mb-2">{h}</h2>
              <p className="text-muted-foreground leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;