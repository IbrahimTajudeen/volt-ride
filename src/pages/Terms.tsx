import { Layout } from "@/components/layout/Layout";
import { useI18n } from "@/i18n/I18nProvider";

const Terms = () => {
  const { t, lang } = useI18n();
  const en = [
    ["1. Acceptance of Terms", "By accessing or using Voltride, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use our services."],
    ["2. Products & Orders", "All product listings are offers subject to acceptance and stock availability. We reserve the right to refuse or cancel any order at our discretion."],
    ["3. Pricing & Payment", "Prices are shown in USD unless otherwise noted and may change without notice. Payments are processed by our trusted partners using industry-standard encryption."],
    ["4. Shipping & Delivery", "We aim to dispatch in-stock orders within 2 business days. Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery."],
    ["5. Returns & Warranty", "Most Voltride products carry a 3-year limited warranty on motors and batteries. Returns are accepted within 30 days for unused items in original packaging."],
    ["6. Intellectual Property", "All site content, trademarks, designs, and software are owned by Voltride Mobility, Inc. or its licensors and protected by applicable laws."],
    ["7. Limitation of Liability", "To the maximum extent permitted by law, Voltride is not liable for indirect, incidental, or consequential damages arising from product use."],
    ["8. Changes to Terms", "We may update these Terms from time to time. Continued use of the service after changes constitutes acceptance of the revised Terms."],
    ["9. Contact", "Questions about these Terms can be sent to legal@voltride.com."],
  ];
  const he = [
    ["1. הסכמה לתנאים", "השימוש באתר וולטרייד מהווה הסכמה לתנאי השימוש ולמדיניות הפרטיות. אם אינך מסכים, אנא הימנע משימוש בשירות."],
    ["2. מוצרים והזמנות", "כל פרטי המוצרים מהווים הצעה הכפופה לאישור ולמלאי. אנו שומרים את הזכות לסרב או לבטל הזמנות לפי שיקול דעתנו."],
    ["3. מחירים ותשלום", "המחירים מוצגים בדולר אלא אם צוין אחרת ועשויים להשתנות ללא הודעה מוקדמת. התשלומים מעובדים על ידי שותפינו תוך הצפנה מתקדמת."],
    ["4. משלוחים", "אנו שואפים לשלוח הזמנות במלאי תוך 2 ימי עסקים. זמני המשלוח הם הערכה בלבד. הסיכון להפסד עובר אליך עם המסירה."],
    ["5. החזרות ואחריות", "רוב המוצרים מגיעים עם 3 שנות אחריות מוגבלת על המנוע והסוללה. החזרות יתקבלו תוך 30 יום למוצרים לא משומשים באריזה מקורית."],
    ["6. קניין רוחני", "כל התכנים, הסימנים המסחריים והעיצובים שייכים ל-Voltride Mobility Inc. ומוגנים על פי דין."],
    ["7. הגבלת אחריות", "ככל המותר על פי דין, וולטרייד אינה אחראית לנזקים עקיפים או תוצאתיים הנובעים משימוש במוצרים."],
    ["8. עדכוני תנאים", "אנו עשויים לעדכן את התנאים מעת לעת. המשך השימוש לאחר שינוי מהווה הסכמה."],
    ["9. יצירת קשר", "שאלות בנוגע לתנאים יש להפנות ל-legal@voltride.com."],
  ];
  const items = lang === "he" ? he : en;

  return (
    <Layout>
      <section className="container-px mx-auto max-w-3xl py-16">
        <h1 className="font-display text-4xl lg:text-5xl font-bold">{t("legal.termsTitle")}</h1>
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

export default Terms;