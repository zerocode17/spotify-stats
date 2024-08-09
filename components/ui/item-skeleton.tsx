import { Skeleton } from "./skeleton";

export default function ItemSkeleton() {
  return (
    <div>
      <ul className="space-y-4">
        <li className="flex space-x-2">
          <Skeleton className="h-16 w-16 rounded-md"></Skeleton>
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-44"></Skeleton>
            <Skeleton className="h-4 w-32"></Skeleton>
          </div>
        </li>
      </ul>
    </div>
  );
}
