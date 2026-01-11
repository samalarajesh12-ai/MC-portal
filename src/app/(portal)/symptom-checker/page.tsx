import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SymptomCheckerForm from './_components/symptom-checker-form';

export default function SymptomCheckerPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Symptom Checker</CardTitle>
          <CardDescription>
            Describe your symptoms, and our AI will provide potential insights
            and recommendations. This is not a substitute for professional medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SymptomCheckerForm />
        </CardContent>
      </Card>
    </div>
  );
}
