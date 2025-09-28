import Link from "next/link";
import { useRouter } from "next/router";

export default function Breadcrumbs() {
  const router = useRouter();
  const pathSegments = router.asPath.split("/").filter((segment) => segment);

  return (
    <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-4'>
      <Link
        href='/'
        className='hover:text-blue-600'>
        Home
      </Link>
      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;

        return (
          <div
            key={href}
            className='flex items-center space-x-2'>
            <span>/</span>
            {isLast ? (
              <span className='font-medium text-gray-900 capitalize'>
                {decodeURIComponent(segment)}
              </span>
            ) : (
              <Link
                href={href}
                className='hover:text-blue-600 capitalize'>
                {decodeURIComponent(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
