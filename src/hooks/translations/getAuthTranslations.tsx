import { getTranslations } from "next-intl/server";

export async function getAuthTranslations() {
  const t = await getTranslations("Authentication");

  return {
    confirm_password: t("confirm_password"),
    enter_password: t("enter_password"),
    forgot_password: t("forgot_password"),
    login: t("login"),
    modify_password: t("modify_password"),
    new_password: t("new_password"),
    new_password_title: t("new_password_title"),
    password: t("password"),
    please_include_login: t("please_include_login"),
    reset_password: t("reset_password"),
    NO_PASSWORD: t("NO_PASSWORD"),
    WRONG_PASSWORD: t("WRONG_PASSWORD"),
    WRONG_PASSWORD_RESET: t("WRONG_PASSWORD_RESET"),
    NEED_LOGIN: t("NEED_LOGIN"),
    NEED_LOGIN_FOR_CANCEL_PLAN: t("NEED_LOGIN_FOR_CANCEL_PLAN"),
    NEED_LOGIN_FOR_COUPON: t("NEED_LOGIN_FOR_COUPON"),
    NEED_LOGIN_FOR_PLAN: t("NEED_LOGIN_FOR_PLAN"),
    NEED_LOGIN_TO_SELL: t("NEED_LOGIN_TO_SELL"),
    NEED_LOGIN_TO_UPDATE_CURRENT_USER: t("NEED_LOGIN_TO_UPDATE_CURRENT_USER"),
    reset: t("reset"),
    RESET_PW_LINK: t("RESET_PW_LINK"),
    SUCCESS_AUTHORIZED_CARD: t("SUCCESS_AUTHORIZED_CARD"),
    welcome_back: t("welcome_back"),
    welcome: t("welcome"),
    firstname: t("firstname"),
    lastname: t("lastname"),
    enter_email: t("enter_email"),
    Email: t("Email"),
    remember_me: t("remember_me"),
    signup: t("signup"),
    already_have_account: t("already_have_account"),
    dont_have_account: t("dont_have_account"),

    validation_email: t("validation_email"),
    validation_password_min: t("validation_password_min"),
    validation_password_max: t("validation_password_max"),
    validation_password_regex: t("validation_password_regex"),
    validation_password_match: t("validation_password_match"),
    validation_first_name_min: t("validation_first_name_min"),
    validation_first_name_max: t("validation_first_name_max"),
    validation_first_name_regex: t("validation_first_name_regex"),
    validation_last_name_min: t("validation_last_name_min"),
    validation_last_name_max: t("validation_last_name_max"),
    validation_last_name_regex: t("validation_last_name_regex"),

    reset_password_modal_description: t("reset_password_modal_description"),

    setup_profile_title: t("setup_profile_title"),
    create_profile: t("create_profile"),
  };
}

export type AuthTranslations = Awaited<ReturnType<typeof getAuthTranslations>>;
