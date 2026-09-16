import NotFoundFallback from "@/components/ui/NotFoundFallback";

export default function MentorNotFound() {
  return (
    <NotFoundFallback
      title="Not found"
      message="This course or page doesn't exist, or you don't have access to it."
      homeHref="/mentor"
      homeLabel="Back to dashboard"
    />
  );
}
