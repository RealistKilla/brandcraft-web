import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about our company and mission",
};

export default function AboutPage() {
  return (
    <div className="container max-w-3xl mx-auto py-16 px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight mb-6">
        About <span className="text-primary">brandcraft</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-10">
        <span className="text-primary">brandcraft</span> is the AI marketing
        platform that turns customer data into ready-to-launch personas,
        strategies, and content—helping teams market smarter, faster, and with
        more impact.
      </p>

      <div className="grid gap-10 md:grid-cols-3 text-left">
        <div>
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p className="text-muted-foreground">
            Empower marketers to unlock the full potential of their data with
            AI, bridging the gap between insights and creativity.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Our Team</h2>
          <p className="text-muted-foreground">
            A group of builders, strategists, and creatives driven to make
            data-driven marketing effortless, scalable, and human.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Our Technology</h2>
          <p className="text-muted-foreground">
            Combining AI, automation, and intuitive design,{" "}
            <span className="text-primary">brandcraft</span> helps teams create
            campaigns that resonate—at the speed of digital.
          </p>
        </div>
      </div>
    </div>
  );
}
