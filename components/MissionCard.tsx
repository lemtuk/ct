import PillarAura from "@/components/animations/PillarAura";

type MissionCardProps = {
  icon: string;
  title: string;
  aura: "planes" | "horizon" | "mesh";
};

export default function MissionCard({ icon, title, aura }: MissionCardProps) {
  return (
    <article className="bc-mission-card">
      <PillarAura variant={aura} />
      <button type="button" className="bc-mission-card__arrow" aria-label={`Explore ${title}`}>
        ↗
      </button>
      <div className="bc-mission-card__footer">
        <span className="bc-mission-card__icon">{icon}</span>
        <h3>{title}</h3>
      </div>
    </article>
  );
}
