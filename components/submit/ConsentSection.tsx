import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldErrors } from "react-hook-form";

interface ConsentSectionProps {
  consentGiven: boolean;
  onConsentChange: (checked: boolean) => void;
  errors: FieldErrors<any>;
}

export function ConsentSection({ consentGiven, onConsentChange, errors }: ConsentSectionProps) {
  return (
    <Card className="border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20">
      <CardHeader>
        <CardTitle className="text-yellow-800 dark:text-yellow-200">
          Consent Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent_given"
            checked={consentGiven}
            onCheckedChange={(checked) => onConsentChange(checked as boolean)}
          />
          <div className="space-y-1">
            <Label
              htmlFor="consent_given"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I consent to having my name and LinkedIn profile visible to future students *
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your submission will help other students prepare for their interviews. Your contact information will be shared to enable networking.
            </p>
          </div>
        </div>
        {errors.consent_given && (
          <p className="text-sm text-red-600 mt-2">
            {errors.consent_given.message?.toString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
