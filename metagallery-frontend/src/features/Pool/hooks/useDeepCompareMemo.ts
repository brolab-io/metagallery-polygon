import { useRef } from "react";

const useDeepCompareMemo = <T>(value: T) => {
  const ref = useRef<T>();

  // it is a shallow compare
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
};

function isEqual(value: any, current: any) {
  try {
    return JSON.stringify(value) === JSON.stringify(current);
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default useDeepCompareMemo;
