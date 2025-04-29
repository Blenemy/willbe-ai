import Image from "next/image";
import MailIcon from "@/assets/calendar/yellow_mail.svg";
import LinkedinIcon from "@/assets/linkedin.svg";
import MessageIcon from "@/assets/calendar/blue_message.svg";
import FollowUpIconYellow from "@/assets/calendar/yellow_follow_up.svg";
import FollowUpIconBlue from "@/assets/calendar/blue_follow_up.svg";

export const getMessageIcon = (type: string, size = 16) => {
  let src: string;
  const alt = type;

  switch (type) {
    case "first_email":
      src = MailIcon;
      break;

    case "follow_up_email":
      src = FollowUpIconYellow;
      break;

    case "linkedin_connection":
      src = LinkedinIcon;
      break;

    case "linkedin_message":
      src = MessageIcon;
      break;

    case "linkedin_follow_up":
      src = FollowUpIconBlue;
      break;

    default:
      src = MailIcon;
  }

  return <Image src={src} alt={alt} width={size} height={size} />;
};
