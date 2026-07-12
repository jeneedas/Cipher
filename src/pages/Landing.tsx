import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type NetworkNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
};

export default function Landing() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const context: CanvasRenderingContext2D = ctx;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let nodes: NetworkNode[] = [];

    const createNodes = () => {
      nodes = Array.from({ length: 38 }, (_, index) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 180;

        return {
          x: width / 2 + Math.cos(angle) * distance,
          y: height / 2 + Math.sin(angle) * distance,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          radius: 1 + Math.random() * 1.3,
          phase: index * 0.4 + Math.random() * 4,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;

      width = rect.width;
      height = rect.height;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      createNodes();
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);

      const seconds = time * 0.001;
      const pulse = (Math.sin(seconds * 0.65) + 1) / 2;

      const centreX = width / 2;
      const centreY = height / 2;

      const gradient = context.createRadialGradient(
        centreX,
        centreY,
        0,
        centreX,
        centreY,
        Math.min(width, height) * 0.42
      );

      gradient.addColorStop(
        0,
        `rgba(62, 207, 142, ${0.035 + pulse * 0.035})`
      );
      gradient.addColorStop(0.5, "rgba(62, 207, 142, 0.012)");
      gradient.addColorStop(1, "rgba(62, 207, 142, 0)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        const dx = centreX - node.x;
        const dy = centreY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 210) {
          node.vx += dx * 0.00001;
          node.vy += dy * 0.00001;
        }

        if (distance < 45) {
          node.vx -= dx * 0.000008;
          node.vy -= dy * 0.000008;
        }

        node.vx *= 0.999;
        node.vy *= 0.999;
      });

      for (let first = 0; first < nodes.length; first += 1) {
        for (
          let second = first + 1;
          second < nodes.length;
          second += 1
        ) {
          const firstNode = nodes[first];
          const secondNode = nodes[second];

          const dx = firstNode.x - secondNode.x;
          const dy = firstNode.y - secondNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 78) {
            const synchronised =
              Math.sin(seconds * 0.8 + firstNode.phase) > 0.62 &&
              first < 14 &&
              second < 14;

            context.beginPath();
            context.moveTo(firstNode.x, firstNode.y);
            context.lineTo(secondNode.x, secondNode.y);

            context.strokeStyle = synchronised
              ? `rgba(62, 207, 142, ${0.12 + pulse * 0.18})`
              : `rgba(255, 255, 255, ${
                  (1 - distance / 78) * 0.065
                })`;

            context.lineWidth = synchronised ? 0.8 : 0.5;
            context.stroke();
          }
        }
      }

      nodes.forEach((node, index) => {
        const synchronised =
          index < 14 &&
          Math.sin(seconds * 0.8 + node.phase) > 0.62;

        context.beginPath();
        context.arc(
          node.x,
          node.y,
          node.radius,
          0,
          Math.PI * 2
        );

        context.fillStyle = synchronised
          ? `rgba(62, 207, 142, ${0.65 + pulse * 0.3})`
          : "rgba(190, 190, 190, 0.45)";

        context.fill();

        if (synchronised) {
          context.beginPath();
          context.arc(
            node.x,
            node.y,
            node.radius + 4,
            0,
            Math.PI * 2
          );
          context.strokeStyle = "rgba(62, 207, 142, 0.1)";
          context.stroke();
        }
      });

      animationFrame = window.requestAnimationFrame(render);
    };

    resize();

    window.addEventListener("resize", resize);

    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <main className="cipher-landing">
      <nav className="landing-nav">
        <button
          className="landing-brand"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          <span className="landing-brand-mark">C</span>
          <span>Cipher</span>
        </button>

        <div className="landing-nav-actions">
          <a
            className="landing-nav-link"
            href="https://github.com/jeneedas/Cipher"
            target="_blank"
            rel="noreferrer"
          >
            
            GitHub
          </a>

          <button
            className="landing-workspace-button"
            onClick={() => navigate("/dashboard")}
          >
            Enter workspace
            <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="landing-kicker">
            BEHAVIOURAL INTELLIGENCE
          </span>

          <h1>
            Detect the pattern
            <br />
            behind the noise.
          </h1>

          <p>
            Cipher identifies coordinated account behaviour through temporal
            synchronisation and narrative pattern analysis.
          </p>

          <div className="landing-hero-actions">
            <button
              className="landing-primary-action"
              onClick={() => navigate("/new-analysis")}
            >
              Start analysis
              <ArrowRight size={15} />
            </button>

            <a
              className="landing-secondary-action"
              href="#methodology"
            >
              View methodology
            </a>
          </div>
        </div>

        <div className="landing-network">
          <canvas
            ref={canvasRef}
            className="landing-network-canvas"
          />

          <div className="landing-network-centre">
            <span className="landing-network-ring landing-network-ring-one" />
            <span className="landing-network-ring landing-network-ring-two" />

            <div className="landing-network-core">
              <span />
            </div>
          </div>

          <div className="landing-network-label landing-network-label-one">
            <span />
            TEMPORAL SIGNAL
          </div>

          <div className="landing-network-label landing-network-label-two">
            <span />
            NARRATIVE OVERLAP
          </div>
        </div>

        <div className="landing-statement">
          <span>COORDINATION IS BEHAVIOUR.</span>
          <span>NOT A VERDICT.</span>
          <span>NOT FACT CHECKING.</span>
        </div>
      </section>

      <section
        className="landing-signals"
        id="methodology"
      >
        <article>
          <span className="landing-signal-number">01</span>

          <div>
            <h2>Temporal signals</h2>
            <p>
              Detect accounts publishing related narratives inside unusually
              narrow time windows.
            </p>
          </div>
        </article>

        <article>
          <span className="landing-signal-number">02</span>

          <div>
            <h2>Narrative convergence</h2>
            <p>
              Measure language overlap and repeated narrative patterns across
              independent posts.
            </p>
          </div>
        </article>

        <article>
          <span className="landing-signal-number">03</span>

          <div>
            <h2>Coordination clusters</h2>
            <p>
              Group connected behavioural signals into interpretable account
              coordination structures.
            </p>
          </div>
        </article>
      </section>

      <footer className="landing-footer">
        <span>CIPHER</span>
        <p>Behavioural coordination detection.</p>
        <span>2026</span>
      </footer>
    </main>
  );
}
    