/**
 * The examination pattern: how and when each group of classes is assessed.
 * Client-safe, so the admin editor and the public page share these types.
 *
 * The school's printed sheets use the same fields for every group but not
 * always the same columns, so a column is shown only when at least one exam
 * in that group fills it in. Several cells stack a value per class ("L.Nur"
 * on one line, "Nur, Prep" on the next); those are kept as separate lines.
 */

export type ExamRow = {
  /** e.g. "Half Yearly Examination". */
  name: string;
  /** Which classes each line of the other cells applies to, one per line. */
  classes: string;
  marks: string;
  syllabus: string;
  /** When the exam is held. */
  when: string;
  /** Project, oral, activity or practical component. */
  project: string;
  passPercent: string;
  passMarks: string;
};

export type ExamGroup = {
  /** Stable key used for the tab and the page address, e.g. "class-i-v". */
  id: string;
  /** e.g. "Class I – V". */
  title: string;
  /** Optional line under the title, e.g. "Science, Commerce & Arts". */
  subtitle: string;
  rows: ExamRow[];
  /** Rules that apply to every exam in the group, one per line. */
  conditions: string;
  /** Footnotes under the table, one per line. */
  notes: string;
};

export type ExamPattern = {
  /** e.g. "2026–27". */
  session: string;
  /** The paragraph above the tables. Formatted text from the rich-text editor. */
  intro: string;
  /** What the abbreviations in the marks mean, one per line as "W: Written". */
  key: string;
  groups: ExamGroup[];
};

/** Columns in the order they appear, with the heading shown for each. */
export const EXAM_COLUMNS = [
  { key: "classes", label: "Classes" },
  { key: "marks", label: "Marks" },
  { key: "syllabus", label: "Syllabus" },
  { key: "when", label: "When" },
  { key: "project", label: "Project / oral" },
  { key: "passPercent", label: "Pass %" },
  { key: "passMarks", label: "Pass marks" },
] as const satisfies readonly { key: keyof ExamRow; label: string }[];

export const EXAM_ROW_KEYS = ["name", ...EXAM_COLUMNS.map((c) => c.key)] as const;

export const MAX_EXAM_GROUPS = 8;
export const MAX_EXAM_ROWS = 15;

export const blankExamRow = (): ExamRow => ({
  name: "",
  classes: "",
  marks: "",
  syllabus: "",
  when: "",
  project: "",
  passPercent: "",
  passMarks: "",
});

/** A page address fragment from a title: "Class I – V" becomes "class-i-v". */
export function examGroupId(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "group"
  );
}

const row = (r: Partial<ExamRow> & { name: string }): ExamRow => ({ ...blankExamRow(), ...r });

/** Transcribed from the school's 2026–27 sheets, with spelling tidied. */
export const defaultExamPattern: ExamPattern = {
  session: "2026–27",
  intro:
    "<p>Continuous assessment of class work and examinations is considered for promotion at the end of the session, so it is most important that children attend school, examinations and class assignments regularly throughout the session. Revision tests are held before every terminal examination, particularly during revision time. The weightage for each examination is shown below.</p>",
  key: "W: Written\nO: Oral\nP: Project\nV: Viva voce\nAct: Activity\nAsst: Assessment",
  groups: [
    {
      id: "ln-prep",
      title: "LN – Prep",
      subtitle: "Lower Nursery, Nursery and Prep",
      rows: [
        row({
          name: "1st Short Test",
          classes: "L.Nur\nNur, Prep",
          marks: "Not applicable\nW-20",
          syllabus: "Syllabus covered till 17th April 2026",
          when: "In the month of April 2026",
          passMarks: "10",
        }),
        row({
          name: "Half Yearly Examination",
          classes: "L.Nur\nNur, Prep",
          marks: "100 (W-80, O-20)\n80 (W-70, O-10)",
          syllabus: "Syllabus covered till 14th August 2026",
          when: "In the month of September 2026",
          passMarks: "50\n40",
        }),
        row({
          name: "2nd Short Test",
          classes: "L.Nur\nNur, Prep",
          marks: "Not applicable\nW-20",
          syllabus: "Syllabus covered till the last week of October 2026",
          when: "In the last week of November 2026",
          passMarks: "10",
        }),
        row({
          name: "Annual Examination",
          classes: "L.Nur\nNur, Prep",
          marks: "100 (W-80, O-20)\n80 (W-70, O-10)",
          syllabus: "Syllabus covered till 18th January 2027",
          when: "In the month of January 2027",
          passMarks: "50\n40",
        }),
      ],
      conditions: "",
      notes: "Passing percentage is 50%, i.e. 100 out of 200 marks.\nAll dates are tentative and subject to change.",
    },
    {
      id: "class-i-v",
      title: "Class I – V",
      subtitle: "",
      rows: [
        row({
          name: "1st Short Test",
          marks: "Total 20 (W-20)",
          syllabus: "Syllabus covered till 17th April 2026",
          when: "In the month of April 2026",
          project: "N/A",
        }),
        row({
          name: "Half Yearly Examination",
          marks: "Total 100 (W-80, P-20)",
          syllabus: "Syllabus covered till 14th August 2026",
          when: "In the month of September 2026",
          project: "Project: 20 marks",
        }),
        row({
          name: "Class Assignment",
          marks: "Total 20",
          syllabus: "Entire half yearly examination syllabus",
          when: "During normal classes",
          project: "N/A",
        }),
        row({
          name: "Activity",
          marks: "Total 20",
          syllabus: "Portion covered till the half yearly examination",
          when: "During normal classes",
          project: "N/A",
        }),
        row({
          name: "2nd Short Test",
          marks: "Total 20",
          syllabus: "Portion covered till the last week of October 2026",
          when: "In the last week of November 2026",
          project: "N/A",
        }),
        row({
          name: "Annual Examination",
          marks: "Total 100 (W-80, P-20)",
          syllabus: "Syllabus covered till 18th January 2027",
          when: "In the month of January 2027",
          project: "Project: 20 marks",
        }),
        row({
          name: "Class Assignment",
          marks: "Total 20",
          syllabus: "Entire annual examination syllabus",
          when: "During normal classes",
          project: "N/A",
        }),
      ],
      conditions: "",
      notes:
        "Passing percentage is 40%, i.e. 120 out of 300 marks.\nStudents are also given a grade for attendance, discipline, neatness, handwriting and similar.\nAll dates mentioned above are tentative.",
    },
    {
      id: "class-vi-viii",
      title: "Class VI – VIII",
      subtitle: "",
      rows: [
        row({
          name: "1st Short Test",
          marks: "25 (Written 20 + Asst 5)",
          syllabus: "As done in the class",
          when: "During regular class hours, before the half yearly examination",
          project: "N/A",
          passPercent: "40",
        }),
        row({
          name: "Half Yearly Examination",
          marks: "Total 100 (W-80, Act-10, Oral-10)",
          syllabus: "Syllabus covered till 14.08.2026",
          when: "In the month of September 2026",
          project: "Activity + oral: 20 marks",
          passPercent: "40",
        }),
        row({
          name: "2nd Short Test",
          marks: "25 (Written 20 + Asst 5)",
          syllabus: "As done in the class",
          when: "During regular class hours, before the annual examination",
          project: "N/A",
          passPercent: "40",
        }),
        row({
          name: "Annual Examination",
          marks: "Total 100 (W-80, P-20)",
          syllabus: "Syllabus covered till 15.01.2027",
          when: "During the CISCE examinations 2027",
          project: "Project: 20 marks",
          passPercent: "40",
        }),
      ],
      conditions:
        "75% attendance is a must.\nAdmit cards are issued to candidates who fulfil all the conditions prescribed in the regulations of the council.",
      notes: "All dates are tentative and subject to change.",
    },
    {
      id: "class-ix-xii",
      title: "Class IX – XII",
      subtitle: "Science, Commerce & Arts",
      rows: [
        row({
          name: "Short Test, Class IX",
          marks: "40 written (20 + 20) + 10 for class performance, discipline etc.",
          syllabus: "As done in the class",
          when: "During regular class hours: one before the half yearly and one before the annual examination",
          project: "N/A",
          passPercent: "20",
        }),
        row({
          name: "Short Test, Class X and XII",
          marks: "20 written in each subject",
          syllabus: "Will be notified",
          when: "In the month of July 2026",
          project: "N/A",
          passPercent: "20",
        }),
        row({
          name: "Pre-Selection Test (X and XII), Half Yearly Examination (IX and XI)",
          marks: "100 (W + P + V)",
          syllabus: "Syllabus covered till 14.08.2026",
          when: "In the month of September 2026",
          project: "Project, viva, practical etc.: 30 or 20 as the case may be",
          passPercent: "40",
        }),
        row({
          name: "Selection Test (X and XII), Annual Examination (IX and XI)",
          marks: "100 (W + P + V)",
          syllabus: "X and XII: syllabus to be covered by 16.11.2026\nIX and XI: by 15.01.2027",
          when: "X and XII: in the month of December 2026\nIX and XI: during the CISCE examinations 2027",
          project: "Project, viva, practical etc.: 30 or 20 as the case may be",
          passPercent: "40",
        }),
      ],
      conditions:
        "75% attendance is a must.\nAdmit cards are issued to candidates who fulfil all the conditions prescribed in the regulations of the council.\nTo be promoted, a student must meet the minimum attendance of 75% of working days and fulfil the pass criteria of the council.",
      notes: "All dates are tentative and subject to change.",
    },
  ],
};
