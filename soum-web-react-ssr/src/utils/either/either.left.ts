import { Either } from "./either.type";
import { Right } from "./either.right";

export class Left<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  forceToRight(): A {
    return this.value as unknown as A;
  }

  forceToLeft(): L {
    return this.value;
  }

  isLeft(): this is Left<L, A> {
    return true;
  }

  isRight(): this is Right<L, A> {
    return false;
  }
}

export const left = <L, A>(l: L): Either<L, A> => {
  return new Left(l);
};
