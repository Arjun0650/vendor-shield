import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  CreditCard,
  Network,
  ShieldAlert,
  Landmark,
  Fingerprint,
  Activity,
  Users,
  WalletCards,
} from "lucide-react";

import {
  getVendor,
  getVendorDNA,
  getVendorRelationships,
} from "../services/api";


/* ============================================================
   RISK STYLES
============================================================ */

const riskClass = {
  LOW:
    "bg-emerald-50 text-emerald-700 border-emerald-200",

  MEDIUM:
    "bg-amber-50 text-amber-700 border-amber-200",

  HIGH:
    "bg-orange-50 text-orange-700 border-orange-200",

  CRITICAL:
    "bg-red-50 text-red-700 border-red-200",
};


const signalClass = {
  LOW:
    "border-emerald-100 bg-emerald-50/60 text-emerald-800",

  MEDIUM:
    "border-amber-100 bg-amber-50/60 text-amber-800",

  HIGH:
    "border-orange-100 bg-orange-50/60 text-orange-800",

  CRITICAL:
    "border-red-100 bg-red-50/60 text-red-800",
};


/* ============================================================
   HELPERS
============================================================ */

const money = (value = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;


function pick(obj, ...keys) {
  for (const key of keys) {
    if (
      obj?.[key] !== undefined &&
      obj?.[key] !== null &&
      obj?.[key] !== ""
    ) {
      return obj[key];
    }
  }

  return null;
}


/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function VendorDNA() {
  const { vendorId } = useParams();

  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);

  const [dna, setDna] = useState(null);

  const [relationships, setRelationships] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* ============================================================
     LOAD REAL BACKEND DATA
  ============================================================ */

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        setError("");

        const [
          vendorData,
          dnaData,
          relationshipData,
        ] = await Promise.all([
          getVendor(vendorId),

          getVendorDNA(vendorId),

          getVendorRelationships(vendorId),
        ]);

        setVendor(vendorData);

        setDna(dnaData);

        setRelationships(
          relationshipData
        );
      } catch (err) {
        console.error(
          "Vendor DNA load error:",
          err
        );

        setError(
          "Unable to load vendor intelligence."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [vendorId]);


  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-3 text-sm font-semibold text-slate-600">
            Loading vendor intelligence...
          </p>

        </div>
      </div>
    );
  }


  /* ============================================================
     ERROR
  ============================================================ */

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }


  if (!vendor) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Vendor not found.
      </div>
    );
  }


  /* ============================================================
     NORMALIZE REAL BACKEND DATA
  ============================================================ */

  const risk =
    pick(
      vendor,
      "riskLevel",
      "risk_level"
    ) ||
    pick(
      dna,
      "riskLevel",
      "risk_level"
    ) ||
    "LOW";


  const normalizedRisk =
    String(risk).toUpperCase();


  const riskScore =
    pick(
      vendor,
      "riskScore",
      "risk_score",
      "score"
    ) ??
    pick(
      dna,
      "riskScore",
      "risk_score"
    ) ??
    0;


  const name =
    pick(
      vendor,
      "name",
      "vendor_name"
    ) ||
    pick(
      dna,
      "vendor_name"
    ) ||
    vendorId;


  const id =
    pick(
      vendor,
      "id",
      "vendor_id"
    ) ||
    vendorId;


  const exposure =
    pick(
      vendor,
      "paymentExposure",
      "payment_exposure",
      "exposure"
    ) ?? 0;


  const bankAccount =
    pick(
      vendor,
      "bankAccount",
      "bank_account"
    ) ||
    "Not available";


  const bankIfsc =
    pick(
      vendor,
      "bankIfsc",
      "bank_ifsc"
    ) ||
    "Not available";


  const gstin =
    pick(
      vendor,
      "gstin",
      "GSTIN"
    ) ||
    "Not available";


  const pan =
    pick(
      vendor,
      "pan",
      "PAN"
    ) ||
    "Not available";


  const phone =
    pick(
      vendor,
      "phone"
    ) ||
    "Not available";


  const email =
    pick(
      vendor,
      "email"
    ) ||
    "Not available";


  const lastChange =
    pick(
      vendor,
      "lastChange",
      "last_change",
      "changed_at"
    ) ||
    "No recent change";


  const signals =
    dna?.signals || [];


  const riskDna =
    dna?.risk_dna ||
    dna?.riskDNA ||
    {};


  const nodes =
    relationships?.nodes || [];


  const edges =
    relationships?.edges || [];


  const nodeCount =
    relationships?.node_count ??
    nodes.length;


  const edgeCount =
    relationships?.edge_count ??
    edges.length;


  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <div className="space-y-6">

      {/* BACK BUTTON */}

      <button
        type="button"
        onClick={() =>
          navigate("/vendors")
        }
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft size={15} />

        Back to vendors
      </button>


      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Building2 size={25} />
          </div>

          <div>

            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600">
              Vendor DNA
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {name}
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              {id}
            </p>

          </div>

        </div>


        <div className="text-left md:text-right">

          <div
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
              riskClass[normalizedRisk] ||
              riskClass.LOW
            }`}
          >
            {normalizedRisk}
          </div>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {riskScore}
          </p>

          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            Risk score / 100
          </p>

        </div>

      </div>


      {/* ========================================================
          TOP METRICS
      ======================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

        <InfoCard
          icon={CreditCard}
          title="Payment Exposure"
          value={money(exposure)}
        />

        <InfoCard
          icon={Landmark}
          title="Bank IFSC"
          value={bankIfsc}
        />

        <InfoCard
          icon={ShieldAlert}
          title="Last Change"
          value={lastChange}
        />

        <InfoCard
          icon={Network}
          title="Graph Connections"
          value={`${nodeCount} nodes • ${edgeCount} edges`}
        />

      </div>


      {/* ========================================================
          RISK DNA
      ======================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
            Explainable Risk Profile
          </p>

          <h2 className="mt-1 text-sm font-bold text-slate-900">
            Risk DNA
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Contribution of each risk dimension to this vendor&apos;s overall score.
          </p>

        </div>


        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <DnaCard
            icon={Fingerprint}
            title="Identity"
            score={riskDna.identity || 0}
          />

          <DnaCard
            icon={WalletCards}
            title="Banking"
            score={riskDna.banking || 0}
          />

          <DnaCard
            icon={Activity}
            title="Behaviour"
            score={riskDna.behaviour || 0}
          />

          <DnaCard
            icon={Users}
            title="Relationships"
            score={riskDna.relationships || 0}
          />

        </div>

      </section>


      {/* ========================================================
          PROFILE + SIGNALS
      ======================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* PROFILE */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-sm font-bold text-slate-900">
            Identity & Banking Profile
          </h2>


          <div className="mt-5 space-y-3">

            <Row
              label="Vendor ID"
              value={id}
            />

            <Row
              label="GSTIN"
              value={gstin}
            />

            <Row
              label="PAN"
              value={pan}
            />

            <Row
              label="Bank Account"
              value={bankAccount}
            />

            <Row
              label="Bank IFSC"
              value={bankIfsc}
            />

            <Row
              label="Phone"
              value={phone}
            />

            <Row
              label="Email"
              value={email}
            />

          </div>

        </section>


        {/* ======================================================
            RISK SIGNALS
        ====================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-sm font-bold text-slate-900">
              Risk Signals
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
              {signals.length} detected
            </span>

          </div>


          <div className="mt-4 space-y-3">

            {signals.length ? (

              signals.map(
                (signal, index) => {

                  const severity =
                    String(
                      signal?.severity ||
                      "MEDIUM"
                    ).toUpperCase();

                  const title =
                    signal?.title ||
                    signal?.type ||
                    signal?.signal_type ||
                    "Risk Signal";

                  const description =
                    signal?.description ||
                    signal?.message ||
                    signal?.evidence ||
                    (
                      typeof signal ===
                      "string"
                        ? signal
                        : "Risk signal detected."
                    );

                  const points =
                    signal?.points ??
                    signal?.score_contribution;

                  return (
                    <div
                      key={`${title}-${index}`}
                      className={`rounded-xl border p-4 ${
                        signalClass[
                          severity
                        ] ||
                        signalClass.MEDIUM
                      }`}
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-xs font-bold">
                            {String(title)
                              .replaceAll(
                                "_",
                                " "
                              )}
                          </p>

                          <p className="mt-1 text-[11px] leading-5 opacity-80">
                            {description}
                          </p>

                        </div>


                        {points !==
                          undefined &&
                          points !==
                            null && (

                          <span className="shrink-0 rounded-full bg-white/70 px-2 py-1 text-[10px] font-bold">
                            +{points} pts
                          </span>

                        )}

                      </div>


                      <p className="mt-2 text-[9px] font-bold uppercase tracking-wider opacity-60">
                        {severity}
                      </p>

                    </div>
                  );
                }
              )

            ) : (

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                <p className="text-xs font-semibold text-emerald-700">
                  No risk signals detected
                </p>

                <p className="mt-1 text-[11px] text-emerald-600">
                  No configured risk rules were triggered for this vendor.
                </p>

              </div>

            )}

          </div>

        </section>

      </div>


      {/* ========================================================
          NETWORKX RELATIONSHIP INTELLIGENCE
      ======================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Network size={18} />
            </div>

            <div>

              <h2 className="text-sm font-bold text-slate-900">
                Relationship Intelligence
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-400">
                NetworkX relationship data connected to this vendor
              </p>

            </div>

          </div>


          <div className="flex gap-2">

            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-600">
              {nodeCount} Nodes
            </span>

            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-600">
              {edgeCount} Edges
            </span>

          </div>

        </div>


        {nodes.length ? (

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {nodes
              .slice(0, 12)
              .map((node) => (

                <div
                  key={node.id}
                  className={`rounded-xl border p-3 ${
                    node.selected
                      ? "border-blue-200 bg-blue-50"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >

                  <div className="flex items-center justify-between gap-2">

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {node.type ||
                        "Entity"}
                    </p>


                    {node.risk && (

                      <span
                        className={`rounded-full border px-2 py-0.5 text-[8px] font-bold ${
                          riskClass[
                            String(
                              node.risk
                            ).toUpperCase()
                          ] ||
                          riskClass.LOW
                        }`}
                      >
                        {node.risk}
                      </span>

                    )}

                  </div>


                  <p className="mt-2 break-words text-xs font-semibold text-slate-800">
                    {node.data?.label ||
                      node.label ||
                      node.data?.name ||
                      node.name ||
                      node.id}
                  </p>


                  {node.risk_score !==
                    undefined && (

                    <p className="mt-1 text-[10px] text-slate-400">
                      Risk score:{" "}
                      {node.risk_score}
                    </p>

                  )}

                </div>

              ))}

          </div>

        ) : (

          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-5 text-center">

            <p className="text-xs font-semibold text-slate-600">
              No relationship data available.
            </p>

          </div>

        )}


        {nodes.length > 12 && (

          <p className="mt-4 text-center text-[10px] text-slate-400">
            Showing 12 of {nodes.length} network nodes
          </p>

        )}

      </section>

    </div>
  );
}


/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <Icon
        size={17}
        className="text-blue-600"
      />

      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-slate-900">
        {value ?? "Not available"}
      </p>

    </div>
  );
}


/* ============================================================
   PROFILE ROW
============================================================ */

function Row({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2.5">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="max-w-[65%] break-all text-right text-xs font-semibold text-slate-800">
        {value ?? "Not available"}
      </span>

    </div>
  );
}


/* ============================================================
   RISK DNA CARD
============================================================ */

function DnaCard({
  icon: Icon,
  title,
  score,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <div className="flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">

          <Icon size={17} />

        </div>

        <span className="text-xl font-bold text-slate-900">
          {score}
        </span>

      </div>


      <p className="mt-3 text-xs font-bold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        Risk contribution
      </p>

    </div>
  );
}