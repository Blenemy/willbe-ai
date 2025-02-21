import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ProfileCardProps {
  children: React.ReactNode;
  onEdit?: () => void;
  title?: string;
}

const ProfileCard = ({ title, children, onEdit }: ProfileCardProps) => {
  return (
    <Card>
      <CardContent className="py-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          {title && <h3 className="font-semibold text-lg">{title}</h3>}
          {onEdit && (
            <Button type="button" variant="outline" onClick={onEdit}>
              Edit <Edit />
            </Button>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
