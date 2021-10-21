import { MockProxy, mock } from "jest-mock-extended";
import { IKeyboardManager, Key } from "../core/managers/IKeyboardManager";
import Sprite from "../sprite/Sprite";
import Player from "./Player";
import Position from "./Position";

const TEST_PLAYER_ID: Readonly<string> = "test-player-id";
const keyDirection = (...keys: Key[]): [number, number] => {
  let x = 0;
  let y = 0;

  if (keys.includes("ArrowUp")) y--;
  if (keys.includes("ArrowDown")) y++;
  if (keys.includes("ArrowRight")) x++;
  if (keys.includes("ArrowLeft")) x--;

  if (x != 0 && y != 0) {
    x *= Math.sqrt(0.5);
    y *= Math.sqrt(0.5);
  }

  return [x, y];
};

describe("Player", () => {
  let player: Player;
  let keyboardManager: MockProxy<IKeyboardManager>;
  let canvasContext: MockProxy<CanvasRenderingContext2D>;
  const initialPosition = Position.create(0, 0);

  beforeEach(() => {
    const sprite = mock<Sprite>();
    keyboardManager = mock<IKeyboardManager>();
    canvasContext = mock<CanvasRenderingContext2D>();
    player = new Player(sprite, initialPosition, keyboardManager);
    player.position = initialPosition.clone();
  });

  it("should convert to dto", () => {
    player.id = TEST_PLAYER_ID;
    const dto = player.toDTO();
    expect(dto.id).toBe(TEST_PLAYER_ID);
    expect(dto.position).toEqual(initialPosition.toDTO());
  });

  it("should have set id", () => {
    player.id = TEST_PLAYER_ID;
    expect(player.id).toEqual(TEST_PLAYER_ID);
  });

  it("should not move without initial position", () => {
    player['_position'] = null as unknown as Position;
    keyboardManager.isPressed.calledWith("ArrowUp").mockReturnValue(true);

    player.update(100);

    expect(player.position).toBe(null);
  });
  
  it("should not render without initial position ", () => {
    player['_position'] = null as unknown as Position;
    player.render(canvasContext);
    expect(player['sprite'].draw).not.toBeCalled();
  });

  it("should render", () => {
    player.render(canvasContext);
    expect(player['sprite'].draw).toBeCalled();
  });

  it("should move in all directions", () => {
    const directions: Key[][] = [
      [],
      ["ArrowUp"],
      ["ArrowDown"],
      ["ArrowRight"],
      ["ArrowLeft"],
      ["ArrowUp", "ArrowRight"],
      ["ArrowUp", "ArrowLeft"],
      ["ArrowDown", "ArrowRight"],
      ["ArrowDown", "ArrowLeft"],
    ];

    directions.forEach((keys) => {
      testMove(player, keyboardManager, ...keys);
    });

    testMove(player, keyboardManager, "ArrowUp");
  });

  function testMove(
    player: Player,
    _keyboardManager: MockProxy<IKeyboardManager>,
    ...keys: Key[]
  ) {
    const DELTA_TIME = 100;
    const PLAYER_SPEED = player["_speed"];

    keyboardManager.isPressed.mockReset();
    keys.forEach((key) => {
      keyboardManager.isPressed.calledWith(key).mockReturnValue(true);
    });

    player.position = initialPosition.clone();
    player.update(DELTA_TIME);

    const [x, y] = keyDirection(...keys);
    const newX = PLAYER_SPEED * DELTA_TIME * x;
    const newY = PLAYER_SPEED * DELTA_TIME * y;

    expect(player.position.x).toBeCloseTo(newX);
    expect(player.position.y).toBeCloseTo(newY);
  }
});
