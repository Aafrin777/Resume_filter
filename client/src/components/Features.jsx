import React from "react";
import { BrainCircuit, BadgeCheck, Search, Users } from "lucide-react";

const features = [
  {
    icon: <BrainCircuit className="h-10 w-10 text-indigo-600" />,
    title: "AI-Powered Screening",
    description: "Automatically filters resumes based on your custom hiring criteria using advanced AI.",
  },
  {
    icon: <BadgeCheck className="h-10 w-10 text-green-600" />,
    title: "Smart Match Scoring",
    description: "Ranks candidates by how well they match the job requirements and skills.",
  },
  {
    icon: <Search className="h-10 w-10 text-blue-600" />,
    title: "Keyword Highlighting",
    description: "Highlights key skills, experience, and education based on job description.",
  },
  {
    icon: <Users className="h-10 w-10 text-pink-600" />,
    title: "Team Collaboration",
    description: "Share candidate insights and collaborate with your HR team in real-time.",
  },
];

const Features = () => {
  return (
    <section className="py-16 px-6 md:px-20 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Powerful Features</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Unlock the full potential of hiring with intelligent tools designed to streamline and enhance your recruitment process.
        </p>
      </div>

    <div
  key={index}
  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  data-aos="fade-up"
  data-aos-delay={index * 100}
>

        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
