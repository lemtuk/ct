type PillarAuraProps = {
  variant: "planes" | "horizon" | "mesh";
};

export default function PillarAura({ variant }: PillarAuraProps) {
  if (variant === "planes") {
    return (
      <div className="bc-pillar-aura bc-pillar-aura--planes" aria-hidden>
        <div className="bc-pillar-aura__plane bc-pillar-aura__plane--1" />
        <div className="bc-pillar-aura__plane bc-pillar-aura__plane--2" />
        <div className="bc-pillar-aura__plane bc-pillar-aura__plane--3" />
      </div>
    );
  }

  if (variant === "horizon") {
    return (
      <div className="bc-pillar-aura bc-pillar-aura--horizon" aria-hidden>
        <div className="bc-pillar-aura__arc" />
        <div className="bc-pillar-aura__dots" />
      </div>
    );
  }

  return (
    <div className="bc-pillar-aura bc-pillar-aura--mesh" aria-hidden>
      <div className="bc-pillar-aura__facet bc-pillar-aura__facet--1" />
      <div className="bc-pillar-aura__facet bc-pillar-aura__facet--2" />
      <div className="bc-pillar-aura__facet bc-pillar-aura__facet--3" />
    </div>
  );
}
