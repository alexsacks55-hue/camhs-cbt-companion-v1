import React, { createContext, useContext, useReducer } from "react";
import { UserRole, AgeBand } from "shared/types/enums";

// ── State ─────────────────────────────────────────────────────────────────────

export interface OnboardingState {
  role: UserRole | null;
  age_band: AgeBand | null;
  consent_given: boolean;
  parental_aware: boolean;
  manual_type: string | null;
}

const initialState: OnboardingState = {
  role: null,
  age_band: null,
  consent_given: false,
  parental_aware: false,
  manual_type: null,
};

// ── Actions ───────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_ROLE"; role: UserRole }
  | { type: "SET_AGE_BAND"; age_band: AgeBand }
  | { type: "SET_CONSENT"; consent_given: boolean }
  | { type: "SET_PARENTAL_AWARE"; parental_aware: boolean }
  | { type: "SET_MANUAL_TYPE"; manual_type: string }
  | { type: "RESET" };

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case "SET_ROLE":
      // Resetting age_band when role changes — it only applies to young_person
      return { ...state, role: action.role, age_band: null, parental_aware: false, manual_type: null };
    case "SET_AGE_BAND":
      return { ...state, age_band: action.age_band };
    case "SET_CONSENT":
      return { ...state, consent_given: action.consent_given };
    case "SET_PARENTAL_AWARE":
      return { ...state, parental_aware: action.parental_aware };
    case "SET_MANUAL_TYPE":
      return { ...state, manual_type: action.manual_type };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface OnboardingContextValue {
  state: OnboardingState;
  setRole: (role: UserRole) => void;
  setAgeBand: (age_band: AgeBand) => void;
  setConsent: (consent_given: boolean) => void;
  setParentalAware: (parental_aware: boolean) => void;
  setManualType: (manual_type: string) => void;
  reset: () => void;
  /** Returns the next route in the onboarding flow for the current state. */
  nextRoute: () => string;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function setRole(role: UserRole) {
    dispatch({ type: "SET_ROLE", role });
  }

  function setAgeBand(age_band: AgeBand) {
    dispatch({ type: "SET_AGE_BAND", age_band });
  }

  function setConsent(consent_given: boolean) {
    dispatch({ type: "SET_CONSENT", consent_given });
  }

  function setParentalAware(parental_aware: boolean) {
    dispatch({ type: "SET_PARENTAL_AWARE", parental_aware });
  }

  function setManualType(manual_type: string) {
    dispatch({ type: "SET_MANUAL_TYPE", manual_type });
  }

  function reset() {
    dispatch({ type: "RESET" });
  }

  /**
   * Determines the next page after the current onboarding step.
   * Called after each step to decide where to navigate.
   */
  function nextRoute(): string {
    if (!state.role) return "/onboarding/role";

    if (state.role === UserRole.YoungPerson) {
      if (!state.age_band) return "/onboarding/age";
      if (state.age_band === AgeBand.ElevenToFifteen && !state.parental_aware) {
        return "/onboarding/parental-awareness";
      }
    }

    if (
      (state.role === UserRole.YoungPerson || state.role === UserRole.ParentCarer) &&
      !state.manual_type
    ) {
      return "/onboarding/treatment";
    }

    return "/auth/sign-up";
  }

  return (
    <OnboardingContext.Provider
      value={{ state, setRole, setAgeBand, setConsent, setParentalAware, setManualType, reset, nextRoute }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within <OnboardingProvider>");
  return ctx;
}
