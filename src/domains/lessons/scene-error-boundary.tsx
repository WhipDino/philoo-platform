"use client";

import Link from "next/link";
import {
  Component,
  type ReactNode,
} from "react";
import styles from "./lesson-player.module.css";

interface SceneErrorBoundaryProps {
  children: ReactNode;
  onExitHref: string;
  resetKey: string;
}

interface SceneErrorBoundaryState {
  hasError: boolean;
}

export class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: SceneErrorBoundaryProps) {
    if (
      this.state.hasError &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <section className={styles.sceneError} role="alert">
        <p className={styles.eyebrow}>A investigação continua segura</p>
        <h1 tabIndex={-1}>Esta cena encontrou um problema</h1>
        <p>
          Tente abrir a cena de novo. Seu último ponto guardado permanece aqui.
        </p>
        <div className={styles.errorActions}>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Tentar novamente
          </button>
          <Link href={this.props.onExitHref}>Encerrar e voltar ao início</Link>
        </div>
      </section>
    );
  }
}
