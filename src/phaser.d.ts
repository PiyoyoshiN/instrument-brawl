declare namespace Phaser {
  const AUTO: number;

  class Scene {
    add: GameObjects.GameObjectFactory;

    constructor(config: string);
  }

  class Game {
    constructor(config: Types.Core.GameConfig);
  }

  namespace GameObjects {
    class GameObjectFactory {
      text(x: number, y: number, text: string, style: TextStyle): Text;
    }

    interface TextStyle {
      color?: string;
      fontFamily?: string;
      fontSize?: string;
    }

    class Text {
      setOrigin(x: number, y?: number): this;
    }
  }

  namespace Types.Core {
    interface GameConfig {
      type: number;
      parent: string;
      width: number;
      height: number;
      backgroundColor: string;
      scene: typeof Scene;
    }
  }
}
