/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Onboarding from "./components/Onboarding";
import Workplace from "./components/Workplace";
import { SimulationState, Company, SkillMatrix } from "./types";

export default function App() {
  const [state, setState] = useState<SimulationState>({
    step: "AUTH",
    user: {
      name: "",
      email: "",
      avatar: "",
      provider: null
    },
    skills: {
      TECHNICAL_RIGOR: 50,
      COMMUNICATION: 50,
      ADAPTABILITY: 50,
      RELIABILITY: 50
    },
    company: null,
    emails: [],
    slackChannels: [],
    slackMessages: {},
    activeChannelId: "general",
    tickets: [],
    pullRequest: null,
    history: []
  });

  const handleOnboardingComplete = (
    user: { name: string; email: string; provider: "google" | "github" },
    skills: SkillMatrix,
    assignedCompany: Company
  ) => {
    setState((prev) => ({
      ...prev,
      step: "WORKSPACE",
      user: {
        ...prev.user,
        name: user.name,
        email: user.email,
        provider: user.provider,
        avatar: "🤓"
      },
      skills,
      company: assignedCompany
    }));
  };

  const handleLogout = () => {
    setState({
      step: "AUTH",
      user: {
        name: "",
        email: "",
        avatar: "",
        provider: null
      },
      skills: {
        TECHNICAL_RIGOR: 50,
        COMMUNICATION: 50,
        ADAPTABILITY: 50,
        RELIABILITY: 50
      },
      company: null,
      emails: [],
      slackChannels: [],
      slackMessages: {},
      activeChannelId: "general",
      tickets: [],
      pullRequest: null,
      history: []
    });
  };

  return (
    <div id="app-container" className="min-h-screen bg-slate-950">
      {state.step === "WORKSPACE" && state.company ? (
        <Workplace
          company={state.company}
          userName={state.user.name}
          userEmail={state.user.email}
          initialSkills={state.skills}
          onLogout={handleLogout}
        />
      ) : (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}

