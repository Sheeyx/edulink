import NotFoundFallback from "@/components/ui/NotFoundFallback";

export default function UserNotFound() {
  return (
    <NotFoundFallback
      title="Not found"
      message="This course or page doesn't exist, or you're not enrolled in it."
      homeHref="/user"
      homeLabel="Back to dashboard"
    />
  );
}
