import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

export function TableSortToggle({
  text,
  column,
  sorting,
  setSorting,
  className,
  ...props
}) {
  const handleClick = (event) => {
    event.preventDefault();

    if( sorting.column === column ) {
      // Same column. Toggle direction.
      
      setSorting({
        column,
        direction: sorting.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // New column. Sort ascending.
      setSorting({
        column,
        direction: 'asc'
      });
    }
  };

  const isSorted = sorting.column === column;

  return (
    <a className="group inline-flex cursor-pointer" onClick={handleClick} {...props}>
      {text}
      {
        isSorted ? (
          <span className="flex-none rounded text-gray-600">
          { 
            sorting.direction === 'asc' ?
              <ChevronUpIcon
                className="ml-2 h-4 w-4 flex-none rounded text-gray-600"
                aria-hidden="true"
              /> : 
              <ChevronDownIcon
                className="ml-2 h-4 w-4 flex-none rounded text-gray-600"
                aria-hidden="true"
              />
          }
          </span>    
        ) : (
          <span className="invisible flex-none rounded text-gray-600 group-hover:visible group-focus:visible">
            <ChevronUpIcon
              className="invisible ml-2 h-4 w-4 flex-none rounded text-gray-600 group-hover:visible group-focus:visible"
              aria-hidden="true"
            />
          </span>
        )
      }
    </a>
  )
}
