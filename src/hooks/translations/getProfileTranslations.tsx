import { getTranslations } from "next-intl/server";

export async function getProfileTranslations() {
  const t = await getTranslations("Profile");

  return {
    account_settings: t("account_settings"),

    tab_profile: t("tab_profile"),
    tab_security: t("tab_security"),
    tab_billing: t("tab_billing"),
    tab_connections: t("tab_connections"),
    tab_signature: t("tab_signature"),
    tab_notifications: t("tab_notifications"),
    tab_data_export: t("tab_data_export"),

    profile_title: t("profile_title"),
    profile_section_personal_info: t("profile_section_personal_info"),
    profile_section_language: t("profile_section_language"),
    profile_label_firstname: t("profile_label_firstname"),
    profile_label_lastname: t("profile_label_lastname"),
    profile_label_email: t("profile_label_email"),

    security_title: t("security_title"),
    security_section_password: t("security_section_password"),

    connections_title: t("connections_title"),
    connections_linkedin: t("connections_linkedin"),
    connections_email: t("connections_email"),
    connections_status: t("connections_status"),
    connections_connected: t("connections_connected"),
    connections_not_connected: t("connections_not_connected"),

    connections_connect_linkedin: t("connections_connect_linkedin"),
    connections_connect_gmail: t("connections_connect_gmail"),
    connections_connect_outlook: t("connections_connect_outlook"),
    connections_remove: t("connections_remove"),

    signature_title: t("signature_title"),
    signature_label: t("signature_label"),
    signature_placeholder: t("signature_placeholder"),
    signature_submit: t("signature_submit"),
  };
}

export type ProfileTranslations = Awaited<
  ReturnType<typeof getProfileTranslations>
>;
