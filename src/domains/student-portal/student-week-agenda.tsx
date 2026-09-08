"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { X } from "@phosphor-icons/react";
import {
  WEEKDAY_DEFS,
  WEEK_PLAN_STORAGE_KEY,
  buildWeekAgenda,
  defaultWeekPlan,
  parseWeekPlan,
  type WeekPlan,
  type WeekdayId,
} from "./student-week-agenda-content";
import styles from "./student-week-agenda.module.css";

type StudentWeekAgendaProps = {
  continueTitle: string;
  continueHref: string;
};

export function StudentWeekAgenda({ continueTitle, continueHref }: StudentWeekAgendaProps) {
  const titleId = useId();
  const [plan, setPlan] = useState<WeekPlan>(defaultWeekPlan);
  const [setupOpen, setSetupOpen] = useState(false);

  useEffect(() => {
    setPlan(parseWeekPlan(window.localStorage.getItem(WEEK_PLAN_STORAGE_KEY)));
  }, []);

  const agenda = buildWeekAgenda({ plan, continueTitle, continueHref });

  function savePlan(next: WeekPlan) {
    setPlan(next);
    window.localStorage.setItem(WEEK_PLAN_STORAGE_KEY, JSON.stringify(next));
    setSetupOpen(false);
  }

  return (
    <section className={styles.wrap} aria-labelledby={titleId}>
      <header className={styles.head}>
        <div>
          <p className={styles.eyebrow}>Sua semana</p>
          <h2 id={titleId}>Agenda</h2>
          <p className={styles.lead}>
            {agenda.weekLabel} · {plan.weekdayIds.length}{" "}
            {plan.weekdayIds.length === 1 ? "encontro" : "encontros"} de {plan.minutes} min
          </p>
        </div>
        <button type="button" className={styles.adjust} onClick={() => setSetupOpen(true)}>
          Ajustar semana
        </button>
      </header>

      <div className={styles.board}>
        <div className={styles.cell}>
          <p className={styles.todoLabel}>Pendências</p>
          {agenda.todo.length === 0 ? (
            <p className={styles.empty}>Nada atrasado nesta semana.</p>
          ) : (
            <ul className={styles.todoList}>
              {agenda.todo.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <Link href={item.href}>{item.title}</Link>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {agenda.days.map((day) => (
          <div key={day.id} className={styles.cell} data-today={day.isToday || undefined}>
            <p className={styles.dayPill}>{day.label}</p>
            <p className={styles.dayNum}>{day.dateNum}</p>
            {day.events.length === 0 ? (
              <p className={styles.empty}>—</p>
            ) : (
              <ul className={styles.events}>
                {day.events.map((event) => (
                  <li key={event.id} data-kind={event.kind}>
                    {event.href ? (
                      <Link href={event.href}>
                        <strong>{event.title}</strong>
                        <span>{event.detail}</span>
                      </Link>
                    ) : (
                      <>
                        <strong>{event.title}</strong>
                        <span>{event.detail}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {setupOpen ? (
        <WeekPlanDialog plan={plan} onClose={() => setSetupOpen(false)} onSave={savePlan} />
      ) : null}
    </section>
  );
}

function WeekPlanDialog({
  plan,
  onClose,
  onSave,
}: {
  plan: WeekPlan;
  onClose: () => void;
  onSave: (plan: WeekPlan) => void;
}) {
  const titleId = useId();
  const [times, setTimes] = useState(plan.weekdayIds.length);
  const [minutes, setMinutes] = useState(plan.minutes);
  const [days, setDays] = useState<WeekdayId[]>([...plan.weekdayIds]);

  function toggleDay(id: WeekdayId) {
    setDays((current) => {
      if (current.includes(id)) {
        return current.filter((day) => day !== id);
      }
      if (current.length >= times) {
        return [...current.slice(1), id];
      }
      return [...current, id];
    });
  }

  function submit() {
    const weekdayIds = days.slice(0, times);
    if (weekdayIds.length === 0) {
      return;
    }
    onSave({ weekdayIds, minutes });
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <form
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <header className={styles.sheetHead}>
          <div>
            <p className={styles.eyebrow}>Combinar com a Philoo</p>
            <h3 id={titleId}>Quanto tempo você tem?</h3>
            <p>A escola e a professora continuam no ritmo delas. Isso só organiza a sua semana.</p>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
            <X size={18} weight="bold" />
          </button>
        </header>

        <fieldset className={styles.fieldset}>
          <legend>Vezes nesta semana</legend>
          <div className={styles.pills}>
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                type="button"
                aria-pressed={times === count}
                onClick={() => {
                  setTimes(count);
                  setDays((current) => current.slice(0, count));
                }}
              >
                {count}×
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Quais dias</legend>
          <div className={styles.pills}>
            {WEEKDAY_DEFS.map((day) => (
              <button
                key={day.id}
                type="button"
                aria-pressed={days.includes(day.id)}
                onClick={() => toggleDay(day.id)}
              >
                {day.label.slice(0, 3)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Minutos por encontro</legend>
          <div className={styles.pills}>
            {[20, 40, 60].map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={minutes === value}
                onClick={() => setMinutes(value)}
              >
                {value} min
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" className={styles.save}>
          Guardar na agenda
        </button>
      </form>
    </div>
  );
}
