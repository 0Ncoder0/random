type E = "farmer" | "fox" | "goat" | "grain";
type State = { right: E[]; left: E[] };

const isSafeSide = (side: E[]): boolean => {
  if (side.includes("farmer")) return true;
  if (side.includes("goat") && side.includes("fox")) return false;
  if (side.includes("goat") && side.includes("grain")) return false;
  return true;
};

const isSafe = (state: State): boolean => {
  return isSafeSide(state.right) && isSafeSide(state.left);
};

const isGoal = (state: State): boolean => {
  return state.right.length === 4;
};

const whereIsFarmer = (state: State): "right" | "left" => {
  return state.right.includes("farmer") ? "right" : "left";
};

const isCircle = (state: State, path: State[]): boolean => {
  return path.some((s) => s.left.length === state.left.length && s.left.every((e) => state.left.includes(e)));
};

const copy = (state: State): State => {
  return { left: [...state.left], right: [...state.right] };
};

const moveToSide = (state: State, to: "right" | "left", e: E): State => {
  state = copy(state);
  const from = to === "right" ? "left" : "right";

  state[from] = state[from].filter((x) => ![e, "farmer"].includes(x));

  state[to].push(e);
  if (e !== "farmer") state[to].push("farmer");

  return state;
};

const next = async (state: State, path: State[]): Promise<State[] | null> => {
  await new Promise((r) => setTimeout(r, 500));
  const form = whereIsFarmer(state);
  const to = form === "right" ? "left" : "right";

  const nexts = [...state[form]].map((e) => moveToSide(state, to, e));

  for (const state of nexts) {
    if (!isSafe(state)) continue;
    if (isCircle(state, path)) continue;
    if (isGoal(state)) return [...path, state];

    const result = await next(state, [...path, state]);
    if (result) return result;
  }
};

const main = async () => {
  const start: State = { left: ["farmer", "fox", "goat", "grain"], right: [] };
  const path = [start];

  const result = await next(start, path);
  result.forEach((e) => console.log(e));
};

main();
