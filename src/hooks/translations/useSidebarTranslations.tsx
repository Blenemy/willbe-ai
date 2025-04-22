import { getTranslations } from "next-intl/server";

export async function getSidebarTranslations() {
  const t = await getTranslations("Sidebar");

  return {
    home: t("Home"),
    leadGeneration: t("Lead Generation"),
    leadScenarios: t("Lead scenarios"),
    createLeadScenarios: t("Create lead scenarios"),
    accountGeneration: t("Account Generation"),
    accountScenarios: t("Account scenarios"),
    createAccountScenarios: t("Create account scenarios"),
    scenarioList: t("Scenario list"),
    createMessageScenario: t("Create message scenario"),
    messagesGenerator: t("Messages generator"),
    messageStructures: t("Message structures"),
    createMessageStructures: t("Create message structures"),
    data: t("Data"),
    accountList: t("Account List"),
    advancedAnalytics: t("Advanced analytics"),
    analytics: t("Analytics"),
    settings: t("Settings"),
    companySettings: t("Company settings"),
    users: t("Users"),
    myAccount: t("My account"),
    logout: t("Log out"),
  };
}

export type SidebarTranslations = Awaited<
  ReturnType<typeof getSidebarTranslations>
>;
