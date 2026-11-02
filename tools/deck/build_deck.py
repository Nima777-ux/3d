#!/usr/bin/env python3
"""Build the presentation: Data Mining in Healthcare & Disease Prediction.

Design system: monochrome editorial (ink / paper) with one mint accent,
hairline rules, oversized numerals and hand-drawn vector charts.
"""
import os

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR, MSO_AUTO_SIZE
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.dml import MSO_LINE_DASH_STYLE
from pptx.oxml.ns import qn
from pptx.oxml import parse_xml

ART = os.environ.get("DECK_ART", "/tmp/deck/assets")
OUT = os.environ.get("DECK_OUT", "/app/public/Nima-Nabizada-Data-Mining-in-Healthcare.pptx")
TOTAL = 20

# ---------------------------------------------------------------- palette
INK = RGBColor(0x0A, 0x0A, 0x0B)
PAPER = RGBColor(0xF4, 0xF3, 0xEF)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
HAIR_D = RGBColor(0x2A, 0x2A, 0x30)
HAIR_L = RGBColor(0xD9, 0xD8, 0xD1)
MUT_D = RGBColor(0x8E, 0x8E, 0x94)
MUT_L = RGBColor(0x6C, 0x6C, 0x65)
MINT = RGBColor(0x00, 0xD6, 0x9E)
MINT_L = RGBColor(0x00, 0x8F, 0x69)
NEAR = RGBColor(0x15, 0x15, 0x1A)
CHALK = RGBColor(0x74, 0x74, 0x80)

F = "Segoe UI"
FM = "Consolas"

DARK = dict(bg=INK, ink=WHITE, muted=MUT_D, line=HAIR_D, accent=MINT, tag=RGBColor(0x9A, 0x9A, 0xA2))
LIGHT = dict(bg=PAPER, ink=RGBColor(0x0B, 0x0B, 0x0C), muted=MUT_L, line=HAIR_L, accent=MINT_L, tag=MUT_L)

W, H = 13.3333, 7.5
M = 0.85
CW = W - 2 * M
A = "http://schemas.openxmlformats.org/drawingml/2006/main"


# ---------------------------------------------------------------- helpers
def rect(slide, x, y, w, h, fill=None, line=None, lw=0.75, shape=MSO_SHAPE.RECTANGLE, radius=None):
    s = slide.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    s.shadow.inherit = False
    if radius is not None:
        try:
            s.adjustments[0] = radius
        except Exception:
            pass
    if fill is None:
        s.fill.background()
    else:
        s.fill.solid()
        s.fill.fore_color.rgb = fill
    if line is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = line
        s.line.width = Pt(lw)
    return s


def hline(slide, x, y, w, color, lw=0.6):
    c = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x), Inches(y), Inches(x + w), Inches(y))
    c.line.color.rgb = color
    c.line.width = Pt(lw)
    c.shadow.inherit = False
    return c


def vline(slide, x, y, h, color, lw=0.6):
    c = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x), Inches(y), Inches(x), Inches(y + h))
    c.line.color.rgb = color
    c.line.width = Pt(lw)
    c.shadow.inherit = False
    return c


def dot(slide, cx, cy, d, fill=None, line=None, lw=1.0):
    return rect(slide, cx - d / 2, cy - d / 2, d, d, fill=fill, line=line, lw=lw, shape=MSO_SHAPE.OVAL)


def fill_alpha(shape, amt):
    spPr = shape._element.spPr
    sf = spPr.find(qn("a:solidFill"))
    if sf is None or len(sf) == 0:
        return
    sf[0].append(parse_xml('<a:alpha xmlns:a="%s" val="%d"/>' % (A, int(amt))))


def poly(slide, pts, color=None, lw=1.5, fill=None, close=False):
    fb = slide.shapes.build_freeform(Inches(pts[0][0]), Inches(pts[0][1]))
    fb.add_line_segments([(Inches(px), Inches(py)) for px, py in pts[1:]], close=close)
    s = fb.convert_to_shape()
    s.shadow.inherit = False
    if fill is None:
        s.fill.background()
    else:
        s.fill.solid()
        s.fill.fore_color.rgb = fill
    if color is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = color
        s.line.width = Pt(lw)
    return s


def add_text(slide, x, y, w, h, blocks, anchor=MSO_ANCHOR.TOP):
    box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.margin_left = tf.margin_right = 0
    tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = anchor
    for i, b in enumerate(blocks):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = b.get("align", PP_ALIGN.LEFT)
        p.line_spacing = b.get("line", 1.0)
        p.space_before = Pt(b.get("before", 0))
        p.space_after = Pt(0)
        runs = b.get("runs") or [(b.get("t", ""), {})]
        for txt, o in runs:
            r = p.add_run()
            r.text = txt
            f = r.font
            f.name = o.get("font", b.get("font", F))
            f.size = Pt(o.get("size", b.get("size", 12)))
            f.bold = o.get("bold", b.get("bold", False))
            f.italic = o.get("italic", b.get("italic", False))
            f.color.rgb = o.get("color", b.get("color", INK))
            spc = o.get("spc", b.get("spc", 0))
            if spc:
                r._r.get_or_add_rPr().set("spc", str(int(spc)))
    return box


def T(slide, x, y, w, h, text, size=11, color=INK, font=F, bold=False, spc=0, line=1.0,
      align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, italic=False):
    return add_text(slide, x, y, w, h, [dict(t=text, size=size, color=color, font=font, bold=bold,
                                             spc=spc, line=line, align=align, italic=italic)], anchor)


def pic(slide, name, x, y, w, h, alpha=None):
    p = slide.shapes.add_picture(os.path.join(ART, name), Inches(x), Inches(y), Inches(w), Inches(h))
    if alpha is not None:
        p._element.blipFill.blip.append(
            parse_xml('<a:alphaModFix xmlns:a="%s" amt="%d"/>' % (A, int(alpha * 100000))))
    return p


def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


def new(prs, theme):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    rect(s, 0, 0, W, H, fill=theme["bg"])
    return s


def chrome(slide, th, kicker, title, num, section=None, title_size=31):
    T(slide, M, 0.42, 7.6, 0.22, kicker.upper(), size=8.5, color=th["muted"], font=FM, spc=200)
    if section:
        T(slide, W - M - 4.2, 0.42, 4.2, 0.22, section.upper(), size=8.5, color=th["muted"], font=FM,
          spc=200, align=PP_ALIGN.RIGHT)
    hline(slide, M, 0.78, CW, th["line"])
    T(slide, M, 1.02, CW, 0.9, title.upper(), size=title_size, color=th["ink"], bold=True, spc=-45, line=1.02)
    hline(slide, M, 6.88, CW, th["line"])
    T(slide, M, 7.02, 7.0, 0.2, "DATA MINING IN HEALTHCARE  /  NIMA NABIZADA", size=7.5,
      color=th["muted"], font=FM, spc=150)
    T(slide, W - M - 2.0, 7.02, 2.0, 0.2, "%02d / %d" % (num, TOTAL), size=7.5, color=th["muted"],
      font=FM, spc=150, align=PP_ALIGN.RIGHT)


# ---------------------------------------------------------------- slides
def s01_cover(prs):
    th = DARK
    s = new(prs, th)
    pic(s, "cover.png", 0, 0, W, H)

    T(s, M, 0.95, 6.0, 0.22, "MASTERCLASS PRESENTATION", size=8.5, color=th["muted"], font=FM, spc=260)
    hline(s, M, 1.34, 1.5, MINT, 1.4)

    add_text(s, M, 2.15, 7.4, 2.1, [
        dict(t="DATA MINING", size=66, color=WHITE, bold=True, spc=-70, line=0.96),
        dict(t="IN HEALTHCARE", size=66, color=WHITE, bold=True, spc=-70, line=0.96),
    ])
    T(s, M, 3.90, 7.0, 0.4, "AND DISEASE PREDICTION", size=19, color=MINT, spc=130, bold=False)

    hline(s, M, 4.72, CW * 0.82, th["line"])
    T(s, M, 4.94, 7.2, 0.9,
      "Turning clinical records, images and signals into decisions a doctor can act on.",
      size=12, color=th["muted"], line=1.5)

    T(s, M, 6.28, 4.0, 0.2, "PRESENTED BY", size=7.5, color=th["muted"], font=FM, spc=220)
    T(s, M, 6.52, 5.0, 0.3, "NIMA NABIZADA", size=15, color=WHITE, bold=True, spc=90)
    T(s, W - M - 4.0, 6.52, 4.0, 0.3, "02 NOVEMBER 2026", size=8.5, color=th["muted"], font=FM,
      spc=180, align=PP_ALIGN.RIGHT)
    notes(s, "Good morning. My name is Nima Nabizada. Today I want to show how data mining turns the "
             "enormous, messy record of modern medicine into predictions that can change what happens to "
             "a patient. Three parts: the data, the method, and the evidence.")


def s02_agenda(prs):
    th = LIGHT
    s = new(prs, th)
    chrome(s, th, "Contents", "What we will cover", 2, section="Agenda")

    items = [
        ("The data problem", "Why healthcare data is unlike any other data you have mined."),
        ("Sources & structure", "Five streams, five very different failure modes."),
        ("The pipeline", "Six steps from a raw record to a deployed model."),
        ("Techniques", "The six families of algorithms, and when each one earns its place."),
        ("The evidence", "A diabetes prediction case study, end to end."),
        ("Risks & the road ahead", "Privacy, bias, trust — and what is coming next."),
    ]
    for i, (title, desc) in enumerate(items):
        col, row = i // 3, i % 3
        x = M + col * 6.05
        y = 2.05 + row * 1.52
        T(s, x, y, 0.6, 0.2, "%02d" % (i + 1), size=8.5, color=th["accent"], font=FM, spc=150)
        T(s, x + 0.62, y - 0.07, 4.9, 0.3, title.upper(), size=16, color=th["ink"], bold=True, spc=-15)
        T(s, x + 0.62, y + 0.36, 4.85, 0.7, desc, size=10, color=th["muted"], line=1.5)
        hline(s, x, y + 1.16, 5.5, th["line"])
    notes(s, "Six short sections. I will spend most of the time on the pipeline and on the case study, "
             "because that is where theory meets a real clinical decision.")


def divider(prs, num, idx, label, title, sub):
    s = new(prs, DARK)
    pic(s, "divider.png", 0, 0, W, H, alpha=0.75)

    T(s, 8.35, 2.35, 4.6, 3.4, "%02d" % idx, size=200, color=NEAR, bold=True, spc=-220,
      align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE)
    T(s, M, 1.55, 5.0, 0.22, label.upper(), size=8.5, color=DARK["muted"], font=FM, spc=260)
    hline(s, M, 1.92, 1.1, MINT, 1.4)
    lines = title.split("\n")
    add_text(s, M, 2.15, 7.3, 1.9,
             [dict(t=l.upper(), size=52, color=WHITE, bold=True, spc=-70, line=1.0) for l in lines])
    T(s, M, 4.62, 6.4, 1.0, sub, size=14, color=DARK["muted"], line=1.55)
    T(s, W - M - 2.0, 7.02, 2.0, 0.2, "%02d / %d" % (num, TOTAL), size=7.5, color=DARK["muted"],
      font=FM, spc=150, align=PP_ALIGN.RIGHT)
    notes(s, sub)


def s04_problem(prs):
    th = LIGHT
    s = new(prs, th)
    chrome(s, th, "01 — The data problem", "More data, fewer answers", 4, section="The data problem")

    T(s, M, 1.95, 6.15, 2.5,
      "Healthcare produces more data than any other industry. Most clinical decisions still rest on "
      "experience, not evidence at the bedside.", size=27, color=th["ink"], line=1.22)
    T(s, M, 4.72, 5.5, 1.9,
      "Records, scans, waveforms and genomes arrive faster than any clinician can read them. The "
      "opportunity is not more data — it is turning the right data into a decision at the right moment.",
      size=11, color=th["muted"], line=1.6)

    stats = [
        ("30%", "of the world's stored data volume is produced by healthcare", True),
        ("80%", "of that data is unstructured — notes, images and waveforms", False),
        ("74%", "of global deaths are caused by non-communicable disease (WHO)", False),
    ]
    x, y = 7.55, 1.95
    for i, (num, cap, accent) in enumerate(stats):
        top = y + i * 1.58
        hline(s, x, top, 4.95, th["line"])
        T(s, x, top + 0.2, 1.85, 0.7, num, size=40, color=th["accent"] if accent else th["ink"],
          bold=True, spc=-50, line=1.0)
        T(s, x + 1.95, top + 0.36, 3.0, 0.9, cap, size=9.5, color=th["muted"], line=1.5)
    hline(s, x, 1.95 + 3 * 1.58, 4.95, th["line"])
    notes(s, "This is the scale of the problem. Healthcare is the most data-rich industry on earth and "
             "still one of the least data-driven — because the data is enormous, unstructured and locked "
             "in systems that were never designed to share.")


def s05_sources(prs):
    th = LIGHT
    s = new(prs, th)
    chrome(s, th, "01 — The data problem", "Five streams, five problems", 5, section="The data problem")

    cols = [
        ("Electronic health records", "Diagnoses, orders, medications and free-text progress notes.", "UNSTRUCTURED"),
        ("Medical imaging", "CT, MRI, radiographs and digital pathology: petabytes of pixels.", "HIGH VOLUME"),
        ("Genomics & labs", "Sequences, panels and lab values with heavy missingness.", "HIGH DIMENSION"),
        ("Wearables & IoT", "Continuous vitals from monitors, patches and phones.", "STREAMING"),
        ("Claims & admin", "Billing codes: cheap, longitudinal, shaped by reimbursement.", "BIASED"),
    ]
    cw, gap = 2.16, 0.175
    for i, (name, desc, tag) in enumerate(cols):
        x = M + i * (cw + gap)
        T(s, x, 1.98, 0.8, 0.2, "%02d" % (i + 1), size=8.5, color=th["accent"], font=FM, spc=150)
        T(s, x, 2.28, cw, 1.0, name.upper(), size=12.5, color=th["ink"], bold=True, spc=-10, line=1.25)
        T(s, x, 3.62, cw, 1.6, desc, size=9.5, color=th["muted"], line=1.55)
        hline(s, x, 5.42, cw, th["line"])
        T(s, x, 5.56, cw, 0.2, tag, size=7.5, color=th["tag"], font=FM, spc=160)
        if i:
            vline(s, x - gap / 2, 1.98, 3.6, th["line"])
    notes(s, "Five very different streams. Each one fails in its own way: notes are unstructured, imaging "
             "is huge, genomics is high-dimensional, devices stream continuously, and claims are shaped by "
             "money rather than medicine.")


def s07_pipeline(prs):
    th = LIGHT
    s = new(prs, th)
    chrome(s, th, "02 — The method", "From raw records to a live prediction", 7, section="The method")

    steps = [
        ("Acquire", "Pull records, images, labs and device streams into one governed repository."),
        ("Prepare", "De-duplicate, impute, normalise units and resolve ICD / SNOMED codes."),
        ("Engineer", "Build features and windows: trends, comorbidity counts, vitals variability."),
        ("Model", "Train classifiers, regressors and survival models on a held-out split."),
        ("Validate", "Test on separate cohorts: AUC, sensitivity, calibration, subgroup fairness."),
        ("Deploy", "Put it in the workflow, then watch for drift and retrain on new data."),
    ]
    rail_y = 2.72
    sw = (CW - 5 * 0.16) / 6
    hline(s, M, rail_y, CW, th["line"])
    for i, (name, desc) in enumerate(steps):
        x = M + i * (sw + 0.16)
        cx = x + 0.13
        dot(s, cx, rail_y, 0.13, fill=th["bg"], line=th["accent"], lw=1.2)
        dot(s, cx, rail_y, 0.055, fill=th["accent"])
        T(s, cx + 0.16, rail_y - 0.32, 1.4, 0.2, "%02d" % (i + 1), size=9, color=th["accent"], font=FM, spc=140)
        T(s, x, rail_y + 0.32, sw, 0.3, name.upper(), size=13, color=th["ink"], bold=True, spc=-10)
        T(s, x, rail_y + 0.78, sw - 0.05, 2.2, desc, size=9.5, color=th["muted"], line=1.55)
    # arrow head at the end of the rail
    poly(s, [(W - M - 0.1, rail_y - 0.06), (W - M + 0.02, rail_y), (W - M - 0.1, rail_y + 0.06)],
         color=th["line"], lw=0.8)

    hline(s, M, 6.08, CW, th["line"])
    T(s, M, 6.24, CW, 0.5,
      "The model is the smallest part of the work. In practice, preparation and validation consume most of the timeline — and determine whether the result is usable.",
      size=10, color=th["muted"], line=1.5)
    notes(s, "Six steps. Notice how little of this is machine learning: acquiring and preparing data, then "
             "validating on a separate cohort, is where these projects succeed or fail.")


def s08_techniques(prs):
    th = LIGHT
    s = new(prs, th)
    chrome(s, th, "02 — The method", "Six families of technique", 8, section="The method")

    items = [
        ("Classification", "Predicts a label: diabetic or not, readmitted or not. The workhorse of clinical risk models."),
        ("Clustering", "Finds patient subgroups without labels — phenotypes, high-cost cohorts, care pathways."),
        ("Association rules", "Mines co-occurring events: drug combinations, comorbidity patterns, order sequences."),
        ("Regression", "Estimates a quantity: length of stay, cost, the next HbA1c value."),
        ("Anomaly detection", "Flags the unusual: outlier labs, deteriorating vitals, billing irregularities."),
        ("Deep learning", "Learns from pixels and waveforms directly: imaging, ECG, pathology, free text."),
    ]
    cw, ch = 3.72, 1.85
    for i, (name, desc) in enumerate(items):
        col, row = i % 3, i // 3
        x = M + col * 3.93
        y = 1.98 + row * 2.12
        hline(s, x, y, cw, th["line"])
        T(s, x, y + 0.16, 0.6, 0.2, "%02d" % (i + 1), size=8.5, color=th["accent"], font=FM, spc=150)
        T(s, x, y + 0.44, cw, 0.3, name.upper(), size=14.5, color=th["ink"], bold=True, spc=-15)
        T(s, x, y + 0.88, cw - 0.15, 0.9, desc, size=9.5, color=th["muted"], line=1.55)
    notes(s, "Six families. Most clinical value today comes from the least glamorous: classification on "
             "tabular data. Deep learning dominates wherever the input is an image or a waveform.")


def s09_algorithms(prs):
    th = DARK
    s = new(prs, th)
    chrome(s, th, "02 — The method", "The algorithm cheat-sheet", 9, section="The method")

    heads = ["Algorithm", "Best for", "Report", "Watch out"]
    xs = [M, 4.18, 7.28, 9.78]
    ws = [3.15, 2.95, 2.35, 2.7]
    for i, hd in enumerate(heads):
        T(s, xs[i], 1.86, ws[i], 0.2, hd.upper(), size=7.5, color=th["muted"], font=FM, spc=200)

    rows = [
        ("Logistic regression", "Transparent baseline risk scores", "AUC, calibration", "Misses non-linear effects"),
        ("Random forest", "Robust tabular risk models", "AUC, F1", "Opaque once it grows"),
        ("Gradient boosting", "Best accuracy on tabular data", "AUC, log-loss", "Needs tuning; overfits"),
        ("Support vector machine", "Small, high-dimensional sets", "Accuracy, F1", "Scales poorly"),
        ("Convolutional nets", "Radiology, pathology, ECG", "AUC, sensitivity", "Data hungry, opaque"),
        ("LSTM / transformer", "Longitudinal time series", "AUPRC, MAE", "Compute heavy; drifts"),
    ]
    y = 2.16
    for name, best, report, watch in rows:
        hline(s, M, y, CW, th["line"])
        T(s, M, y + 0.14, ws[0], 0.3, name, size=11.5, color=th["ink"], bold=True)
        T(s, xs[1], y + 0.16, ws[1], 0.3, best, size=9, color=th["muted"])
        T(s, xs[2], y + 0.16, ws[2], 0.3, report, size=9, color=th["muted"], font=FM, spc=20)
        T(s, xs[3], y + 0.16, ws[3], 0.3, watch, size=9, color=th["tag"])
        y += 0.72
    hline(s, M, y, CW, th["line"])
    T(s, M, 6.5, CW, 0.2, "RULE OF THUMB — START WITH THE SIMPLEST MODEL A CLINICIAN CAN EXPLAIN, THEN EARN THE COMPLEXITY.",
      size=7.5, color=th["accent"], font=FM, spc=140)
    notes(s, "A practical cheat-sheet. I would always start at the top of this table and only move down when "
             "the simpler model has been shown to be insufficient on a validation cohort.")


def s11_case(prs):
    th = LIGHT
    s = new(prs, th)
    chrome(s, th, "03 — The evidence", "Case study: predicting type-2 diabetes", 11, section="The evidence")

    specs = [
        ("COHORT", "12,000 adults, five-year follow-up"),
        ("INPUTS", "42 variables: labs, vitals, history"),
        ("TARGET", "Onset of type-2 diabetes"),
        ("VALIDATION", "Held-out split + external site"),
    ]
    for i, (k, v) in enumerate(specs):
        y = 2.0 + i * 1.02
        T(s, M, y, 1.5, 0.2, k, size=7.5, color=th["muted"], font=FM, spc=200)
        T(s, M, y + 0.24, 5.1, 0.3, v, size=12.5, color=th["ink"], bold=True)
        hline(s, M, y + 0.78, 5.2, th["line"])

    # chart: AUC by model
    x0, x1 = 8.55, 12.1
    T(s, 6.6, 1.86, 5.9, 0.2, "AUC BY MODEL", size=7.5, color=th["muted"], font=FM, spc=200)
    models = [("Rules", 0.72, False), ("Logistic", 0.81, False), ("Random forest", 0.84, False),
              ("Gradient boosting", 0.87, True), ("Ensemble", 0.88, True)]
    vmin, vmax = 0.65, 0.92
    for i, (name, v, hi) in enumerate(models):
        y = 2.28 + i * 0.66
        T(s, 6.6, y + 0.03, 1.8, 0.2, name, size=9, color=th["ink"] if hi else th["muted"])
        w = (v - vmin) / (vmax - vmin) * (x1 - x0)
        rect(s, x0, y, w, 0.26, fill=th["accent"] if hi else th["line"])
        T(s, x0 + w + 0.08, y + 0.02, 0.6, 0.2, "%.2f" % v, size=9, color=th["ink"] if hi else th["muted"],
          font=FM, spc=20)
    hline(s, 6.6, 6.02, 5.9, th["line"])
    T(s, 6.6, 6.12, 5.9, 0.6,
      "Illustrative results, representative of published electronic-health-record cohorts.",
      size=8, color=th["muted"], line=1.4)
    T(s, M, 6.28, 5.3, 0.6,
      "Gradient boosting buys roughly six AUC points over a rules baseline — and still needs calibration "
      "before a clinician sees it.", size=9.5, color=th["muted"], line=1.5)
    notes(s, "A concrete example. Five models on the same cohort: the jump from rules to gradient boosting "
             "is real, but the last step — calibration — is what makes a score trustworthy at the bedside.")


def s12_signals(prs):
    th = LIGHT
    s = new(prs, th)
    chrome(s, th, "03 — The evidence", "What the model actually learns", 12, section="The evidence")

    feats = [("HbA1c", 24), ("Fasting glucose", 19), ("BMI", 15), ("Age", 12),
             ("Waist circumference", 9), ("Blood pressure", 8), ("Family history", 7), ("Other", 6)]
    bx, bw = 3.95, 4.15
    for i, (name, v) in enumerate(feats):
        y = 2.02 + i * 0.55
        T(s, M, y + 0.02, 2.95, 0.2, name, size=9.5, color=th["ink"], align=PP_ALIGN.RIGHT)
        rect(s, bx, y, bw * v / 26.0, 0.2, fill=th["accent"] if i < 3 else th["line"])
        T(s, bx + bw * v / 26.0 + 0.1, y - 0.01, 0.6, 0.2, "%d%%" % v, size=8.5, color=th["muted"], font=FM)
    hline(s, M, 6.62, 7.3, th["line"])
    T(s, M, 6.72, 7.3, 0.2, "RELATIVE IMPORTANCE, PERMUTATION-BASED", size=7.5, color=th["muted"], font=FM, spc=180)

    vline(s, 8.55, 1.98, 4.7, th["line"])
    side = [
        ("NOT NEW", "The model rediscovers known physiology. That is a good sign, not a disappointment."),
        ("STILL WEAK", "Adherence, income and social support are missing from most records."),
        ("DRIFT", "A change in lab coding can silently break half of these features."),
    ]
    for i, (k, v) in enumerate(side):
        y = 2.05 + i * 1.6
        T(s, 8.95, y, 3.4, 0.2, k, size=7.5, color=th["accent"], font=FM, spc=200)
        T(s, 8.95, y + 0.26, 3.5, 1.0, v, size=10.5, color=th["ink"], line=1.55)
    notes(s, "Interpretability matters more than a fifth decimal of accuracy. Here the model leans on "
             "exactly the markers an endocrinologist would expect, which is why clinicians were willing to "
             "use it.")


def s13_performance(prs):
    th = DARK
    s = new(prs, th)
    chrome(s, th, "03 — The evidence", "More data is not automatically better", 13, section="The evidence")

    train = [0.79, 0.86, 0.90, 0.94, 0.96, 0.97]
    val = [0.71, 0.78, 0.82, 0.85, 0.86, 0.865]
    labels = ["1K", "5K", "10K", "25K", "50K", "100K"]
    X0, X1 = 1.35, 11.9
    YB, YT = 5.55, 2.62
    vmin, vmax = 0.66, 1.0

    def px(i):
        return X0 + (X1 - X0) * i / 5.0

    def py(v):
        return YB - (v - vmin) / (vmax - vmin) * (YB - YT)

    # gap shading
    pts = [(px(i), py(val[i])) for i in range(6)] + [(px(i), py(train[i])) for i in range(5, -1, -1)]
    gap = poly(s, pts, color=None, fill=th["accent"], close=True)
    fill_alpha(gap, 7.5)

    # axes
    hline(s, X0, YB, X1 - X0, th["line"])
    for i, lb in enumerate(labels):
        T(s, px(i) - 0.35, YB + 0.12, 0.7, 0.2, lb, size=7.5, color=th["muted"], font=FM, align=PP_ALIGN.CENTER)
    for v in (0.70, 0.80, 0.90, 1.00):
        hline(s, X0, py(v), 0.12, th["line"])
        T(s, X0 - 0.62, py(v) - 0.09, 0.55, 0.2, "%.2f" % v, size=7.5, color=th["muted"], font=FM,
          align=PP_ALIGN.RIGHT)
    T(s, X0, 6.02, 6.0, 0.2, "TRAINING COHORT SIZE", size=7.5, color=th["muted"], font=FM, spc=180)

    # training line (dashed) and validation line
    tl = poly(s, [(px(i), py(train[i])) for i in range(6)], color=CHALK, lw=1.25)
    tl.line.dash_style = MSO_LINE_DASH_STYLE.DASH
    poly(s, [(px(i), py(val[i])) for i in range(6)], color=th["accent"], lw=2.0)
    for i in range(6):
        dot(s, px(i), py(val[i]), 0.11, fill=th["accent"])
    dot(s, px(5), py(val[5]), 0.26, fill=None, line=th["accent"], lw=0.9)
    T(s, px(5) - 1.5, py(val[5]) - 0.34, 1.3, 0.2, "0.865", size=8.5, color=th["accent"], font=FM,
      align=PP_ALIGN.RIGHT)
    T(s, px(5) - 1.5, py(train[5]) - 0.36, 1.3, 0.2, "0.970", size=8.5, color=th["muted"], font=FM,
      align=PP_ALIGN.RIGHT)

    # legend
    lx, ly = X0, 2.02
    hline(s, lx, ly + 0.08, 0.34, th["accent"], 2.0)
    T(s, lx + 0.44, ly, 1.6, 0.2, "VALIDATION", size=7.5, color=th["muted"], font=FM, spc=180)
    hline(s, lx + 2.1, ly + 0.08, 0.34, CHALK, 1.25)
    T(s, lx + 2.54, ly, 1.6, 0.2, "TRAINING", size=7.5, color=th["muted"], font=FM, spc=180)

    T(s, 6.9, 6.02, 5.6, 0.7,
      "The widening gap is the story: training accuracy keeps climbing while real-world performance "
      "plateaus. Validate on your own population.", size=10, color=th["muted"], line=1.5)
    notes(s, "This is my favourite chart, because it is honest. Training performance goes up forever. "
             "Validation plateaus. Anyone who quotes only the upper curve has not validated anything.")


def s14_applications(prs):
    th = LIGHT
    s = new(prs, th)
    chrome(s, th, "03 — The evidence", "Where it already works", 14, section="The evidence")

    rows = [
        ("Sepsis early warning", "Continuous risk from vitals, labs and nursing notes, surfaced before deterioration.", "6 h earlier"),
        ("Imaging triage", "Prioritise urgent chest CT and radiographs for the next available radiologist.", "3x faster"),
        ("Readmission risk", "Flag 30-day return risk at the point of discharge, with the drivers named.", "30-day horizon"),
        ("Outbreak forecasting", "Nowcast admissions and model spatial spread across regions.", "weekly signal"),
    ]
    for i, (name, desc, metric) in enumerate(rows):
        y = 1.95 + i * 1.12
        hline(s, M, y, CW, th["line"])
        T(s, M, y + 0.2, 0.6, 0.2, "%02d" % (i + 1), size=8.5, color=th["accent"], font=FM, spc=150)
        T(s, M + 0.62, y + 0.14, 3.5, 0.3, name.upper(), size=14, color=th["ink"], bold=True, spc=-10)
        T(s, M + 4.3, y + 0.2, 4.6, 0.7, desc, size=9.5, color=th["muted"], line=1.5)
        T(s, W - M - 2.6, y + 0.16, 2.6, 0.3, metric, size=12, color=th["accent"], bold=True,
          align=PP_ALIGN.RIGHT, spc=20)
    hline(s, M, 1.95 + 4 * 1.12, CW, th["line"])
    T(s, M, 6.5, CW, 0.2, "DIRECTIONAL FIGURES FROM PUBLISHED DEPLOYMENTS — EXACT GAINS VARY BY SITE AND WORKFLOW.",
      size=7.5, color=th["muted"], font=FM, spc=140)
    notes(s, "Four applications that are in production somewhere today. The pattern: the model does not "
             "replace the clinician, it changes the order in which attention is given.")


def s15_challenges(prs):
    th = LIGHT
    s = new(prs, th)
    chrome(s, th, "04 — The responsibility", "Why most pilots never reach the clinic", 15,
           section="The responsibility")

    rows = [
        ("Fragmented data", "Records sit in silos that were never designed to talk to each other.", "HIGH"),
        ("Class imbalance", "The rare events are exactly the events you must catch.", "HIGH"),
        ("Privacy & consent", "Sensitive data cannot simply be pooled and shared.", "HIGH"),
        ("Bias", "Models learn today's inequities and reproduce them at scale.", "HIGH"),
        ("Trust", "Clinicians reject scores they cannot interrogate or override.", "MEDIUM"),
    ]
    for i, (name, desc, risk) in enumerate(rows):
        y = 1.98 + i * 0.94
        hline(s, M, y, CW, th["line"])
        T(s, M, y + 0.22, 0.6, 0.2, "%02d" % (i + 1), size=8.5, color=th["accent"], font=FM, spc=150)
        T(s, M + 0.62, y + 0.2, 3.3, 0.3, name.upper(), size=13, color=th["ink"], bold=True, spc=-10)
        T(s, M + 4.2, y + 0.24, 5.4, 0.35, desc, size=9.5, color=th["muted"], line=1.4)
        T(s, W - M - 1.3, y + 0.22, 1.3, 0.2, risk, size=7.5,
          color=th["accent"] if risk == "HIGH" else th["muted"], font=FM, spc=160, align=PP_ALIGN.RIGHT)
    hline(s, M, 1.98 + 5 * 0.94, CW, th["line"])
    notes(s, "These five reasons account for most failed pilots. None of them is a modelling problem — "
             "they are data, governance and workflow problems.")


def s16_guardrails(prs):
    th = DARK
    s = new(prs, th)
    chrome(s, th, "04 — The responsibility", "Four rules that keep it honest", 16, section="The responsibility")

    cells = [
        ("01", "Lawful basis", "GDPR and HIPAA define what may be processed, for which purpose, and for how long."),
        ("02", "De-identification", "Strip identifiers, control re-identification risk, use the minimum necessary data."),
        ("03", "Fairness audits", "Report performance by age, sex, ethnicity and site — never one aggregate score."),
        ("04", "Human in the loop", "The model advises. A clinician decides, and can override with a reason."),
    ]
    for i, (num, name, desc) in enumerate(cells):
        col, row = i % 2, i // 2
        x = M + col * 5.95
        y = 2.02 + row * 2.3
        T(s, x, y, 1.2, 0.7, num, size=40, color=RGBColor(0x23, 0x23, 0x29), bold=True, spc=-50)
        T(s, x + 1.15, y + 0.16, 4.4, 0.3, name.upper(), size=14, color=WHITE, bold=True, spc=-10)
        T(s, x + 1.15, y + 0.6, 4.3, 1.0, desc, size=9.5, color=th["muted"], line=1.55)
        hline(s, x, y + 1.72, 5.5, th["line"])

    T(s, M, 6.5, CW, 0.2, "A MODEL IS A MEDICAL INTERVENTION. IT NEEDS THE SAME SCRUTINY AS A DRUG.",
      size=7.5, color=th["accent"], font=FM, spc=140)
    notes(s, "Four guardrails. If a project cannot answer all four, it is not ready for patients — however "
             "good its AUC looks on a slide.")


def s17_road(prs):
    th = LIGHT
    s = new(prs, th)
    chrome(s, th, "05 — The road ahead", "What is coming next", 17, section="The road ahead")

    rail_y = 2.85
    hline(s, M, rail_y, CW, th["line"])
    steps = [
        ("2026", "Federated learning", "Hospitals train a shared model without patient data ever leaving the building."),
        ("2027", "Multimodal models", "Imaging, notes and labs read together by one foundation model."),
        ("2028", "Continuous risk", "Wearables turn prediction from an annual event into a live vital sign."),
        ("2030", "Genomic triage", "Germline risk folded into routine screening decisions."),
    ]
    for i, (year, name, desc) in enumerate(steps):
        x = M + i * 2.92
        dot(s, x + 0.06, rail_y, 0.14, fill=th["bg"], line=th["accent"], lw=1.2)
        dot(s, x + 0.06, rail_y, 0.055, fill=th["accent"])
        vline(s, x + 0.06, rail_y - 0.42, 0.42, th["line"])
        T(s, x, rail_y - 0.78, 2.0, 0.3, year, size=15, color=th["ink"], bold=True, spc=40)
        T(s, x, rail_y + 0.3, 2.6, 0.3, name.upper(), size=12, color=th["accent"], bold=True, spc=-5)
        T(s, x, rail_y + 0.72, 2.55, 1.6, desc, size=9.5, color=th["muted"], line=1.55)

    hline(s, M, 6.0, CW, th["line"])
    T(s, M, 6.16, CW, 0.5,
      "The direction of travel is clear: models move from the data warehouse to the bedside, and from one "
      "big model per hospital to shared, privacy-preserving systems.", size=10, color=th["muted"], line=1.5)
    notes(s, "Four developments I expect to matter. The common thread is that data stops moving and models "
             "start travelling — which is also the only way this scales.")


def s18_takeaways(prs):
    th = DARK
    s = new(prs, th)
    chrome(s, th, "Conclusion", "Three things to take away", 18, section="Conclusion")

    items = [
        ("01", "Data quality beats model choice.",
         "A clean cohort with careful labels will outperform a better algorithm on messy data."),
        ("02", "Validate on your own population.",
         "An AUC of 0.9 from another hospital is a hypothesis, not an outcome."),
        ("03", "A model matters only when it changes a decision.",
         "Value is measured in actions taken sooner — not in accuracy on a slide."),
    ]
    for i, (num, head, sub) in enumerate(items):
        y = 1.98 + i * 1.56
        T(s, M, y + 0.06, 0.7, 0.2, num, size=9, color=th["accent"], font=FM, spc=140)
        T(s, M + 0.75, y, 10.6, 0.6, head, size=27, color=WHITE, bold=True, spc=-30, line=1.1)
        T(s, M + 0.75, y + 0.66, 9.6, 0.5, sub, size=10.5, color=th["muted"], line=1.5)
        hline(s, M, y + 1.28, CW, th["line"])
    notes(s, "If you remember three things: data quality, local validation, and the fact that a model only "
             "counts when someone acts on it.")


def s19_refs(prs):
    th = LIGHT
    s = new(prs, th)
    chrome(s, th, "Appendix", "Sources & further reading", 19, section="References")

    refs = [
        ("1", "World Health Organization. Noncommunicable diseases — key facts. 2024."),
        ("2", "Rajkomar A, Dean J, Kohane I. Machine Learning in Medicine. New England Journal of Medicine, 2019."),
        ("3", "Topol EJ. High-performance medicine: the convergence of human and artificial intelligence. Nature Medicine, 2019."),
        ("4", "Beam AL, Kohane IS. Big Data and Machine Learning in Health Care. JAMA, 2018."),
        ("5", "Obermeyer Z, et al. Dissecting racial bias in an algorithm used to manage the health of populations. Science, 2019."),
        ("6", "Shickel B, et al. Deep EHR: a survey of recent advances in deep learning for electronic health records. IEEE JBHI, 2018."),
        ("7", "Goldstein BA, Navar AM, Carter RE. Moving beyond regression techniques in cardiovascular risk prediction. European Heart Journal, 2017."),
        ("8", "U.S. Food & Drug Administration. AI/ML in Software as a Medical Device — action plan. 2021."),
    ]
    for i, (n, t) in enumerate(refs):
        col, row = i // 4, i % 4
        x = M + col * 6.0
        y = 1.98 + row * 1.18
        T(s, x, y + 0.02, 0.4, 0.2, n, size=8, color=th["accent"], font=FM, spc=100)
        T(s, x + 0.42, y, 5.0, 0.95, t, size=9.5, color=th["muted"], line=1.55)
    notes(s, "The sources behind the numbers and the framing.")


def s20_close(prs):
    s = new(prs, DARK)
    pic(s, "cover.png", 0, 0, W, H, alpha=0.55)
    T(s, M, 1.55, 5.0, 0.22, "END OF PRESENTATION", size=8.5, color=DARK["muted"], font=FM, spc=260)
    hline(s, M, 1.92, 1.1, MINT, 1.4)
    T(s, M, 2.15, 9.0, 1.2, "THANK YOU", size=72, color=WHITE, bold=True, spc=-80, line=1.0)
    T(s, M, 3.62, 7.6, 0.5, "Questions and discussion", size=17, color=MINT, spc=60)

    hline(s, M, 5.32, CW * 0.62, DARK["line"])
    T(s, M, 5.52, 4.0, 0.2, "PRESENTED BY", size=7.5, color=DARK["muted"], font=FM, spc=220)
    T(s, M, 5.76, 5.0, 0.3, "NIMA NABIZADA", size=16, color=WHITE, bold=True, spc=90)
    T(s, M, 6.16, 6.0, 0.3,
      "Data mining in healthcare and disease prediction", size=9.5, color=DARK["muted"])
    notes(s, "Thank you. I am happy to take questions on the modelling, the validation design, or the "
             "governance side.")


def main():
    prs = Presentation()
    prs.slide_width = Inches(W)
    prs.slide_height = Inches(H)
    cp = prs.core_properties
    cp.title = "Data Mining in Healthcare & Disease Prediction"
    cp.author = "Nima Nabizada"
    cp.subject = "Data mining in healthcare and disease prediction"
    cp.keywords = "data mining, healthcare, disease prediction, machine learning"
    cp.comments = "Presentation deck — designed for Nima Nabizada."

    s01_cover(prs)
    s02_agenda(prs)
    divider(prs, 3, 1, "Section one", "The data\nproblem",
            "Healthcare is the most data-rich industry on earth — and one of the least data-driven. "
            "Understanding why is the first step.")
    s04_problem(prs)
    s05_sources(prs)
    divider(prs, 6, 2, "Section two", "The method",
            "Mining clinical data is a pipeline, not an algorithm. Six steps decide whether the result can "
            "be trusted at the bedside.")
    s07_pipeline(prs)
    s08_techniques(prs)
    s09_algorithms(prs)
    divider(prs, 10, 3, "Section three", "The evidence",
             "A worked case study, the signals the model relies on, and where prediction is already "
             "changing outcomes.")
    s11_case(prs)
    s12_signals(prs)
    s13_performance(prs)
    s14_applications(prs)
    s15_challenges(prs)
    s16_guardrails(prs)
    s17_road(prs)
    s18_takeaways(prs)
    s19_refs(prs)
    s20_close(prs)

    for slide in prs.slides:
        slide._element.append(parse_xml(
            '<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" '
            'spd="med"><p:fade/></p:transition>'))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    prs.save(OUT)
    print("saved", OUT, "slides:", len(prs.slides))


if __name__ == "__main__":
    main()
