import Link from 'next/link';
import { EmptyState } from '@/components/StateViews';

export default function NotFound() {
  return (
    <div className="container page">
      <EmptyState icon="route" title="This road doesn't go anywhere" body="The page you are looking for does not exist." action={<Link href="/" className="btn btn-primary btn-sm">Back home</Link>} />
    </div>
  );
}
