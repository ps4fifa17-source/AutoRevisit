import DealerPageShell from "./DealerPageShell";
import StickyMobileCTA from "./StickyMobileCTA";
import SimplePage from "./modes/SimplePage";
import FinancePage from "./modes/FinancePage";
import FamilyPage from "./modes/FamilyPage";
import FirstCarPage from "./modes/FirstCarPage";
import PerformancePage from "./modes/PerformancePage";
import ExecutivePage from "./modes/ExecutivePage";
import PremiumPage from "./modes/PremiumPage";
import ValuePage from "./modes/ValuePage";
import EnquiryPage from "./modes/EnquiryPage";

export default function PageModeRenderer(props) {
  const mode = props.mode || "simple";
  const dark = mode === "performance" || mode === "premium";

  let Page = SimplePage;
  if (mode === "enquiry") Page = EnquiryPage;
  if (mode === "finance") Page = FinancePage;
  if (mode === "family") Page = FamilyPage;
  if (mode === "firstcar" || mode === "first_car") Page = FirstCarPage;
  if (mode === "performance") Page = PerformancePage;
  if (mode === "executive") Page = ExecutivePage;
  if (mode === "premium") Page = PremiumPage;
  if (mode === "value") Page = ValuePage;

  return (
    <DealerPageShell dealer={props.dealer} mode={mode}>
      <Page {...props} mode={mode} />
      <StickyMobileCTA page={props.page} dealer={props.dealer} mode={mode} whatsappUrl={props.whatsappUrl} dark={dark} />
    </DealerPageShell>
  );
}
