import TextField from "@/components/inputs/text-field";

function CashMap({ till, setTill }) {
  return (
    <div className="bg-primary-light p-2 mt-2 rounded-md">
      <div className="text-2xl">Notes</div>
      <div className="grid grid-cols-5 gap-2 mb-2">
        <TextField
          inputLabel="$100s"
          divClass="text-3xl"
          inputClass="w-full"
          error={isError(till, "100d")}
          value={till["100d"]}
          onChange={(e: any) => setTill({ ...till, "100d": e.target.value })}
        />
        <TextField
          inputLabel="$50s"
          divClass="text-3xl"
          value={till["50d"]}
          error={isError(till, "50d")}
          onChange={(e: any) => setTill({ ...till, "50d": e.target.value })}
        />
        <TextField
          inputLabel="$20s"
          divClass="text-3xl"
          value={till["20d"]}
          error={isError(till, "20d")}
          onChange={(e: any) => setTill({ ...till, "20d": e.target.value })}
        />
        <TextField
          inputLabel="$10s"
          divClass="text-3xl"
          value={till["10d"]}
          error={isError(till, "10d")}
          onChange={(e: any) => setTill({ ...till, "10d": e.target.value })}
        />
        <TextField
          inputLabel="$5s"
          divClass="text-3xl"
          value={till["5d"]}
          error={isError(till, "5d")}
          onChange={(e: any) => setTill({ ...till, "5d": e.target.value })}
        />
      </div>
      <div className="text-2xl">Coins</div>
      <div className="grid grid-cols-5 gap-2">
        <TextField
          inputLabel="$2s"
          divClass="text-3xl"
          value={till["2d"]}
          error={isError(till, "2d")}
          onChange={(e: any) => setTill({ ...till, "2d": e.target.value })}
        />
        <TextField
          inputLabel="$1s"
          divClass="text-3xl"
          value={till["1d"]}
          error={isError(till, "1d")}
          onChange={(e: any) => setTill({ ...till, "1d": e.target.value })}
        />
        <TextField
          inputLabel="50¢s"
          divClass="text-3xl"
          value={till["50c"]}
          error={isError(till, "50c")}
          onChange={(e: any) => setTill({ ...till, "50c": e.target.value })}
        />
        <TextField
          inputLabel="20¢s"
          divClass="text-3xl"
          value={till["20c"]}
          error={isError(till, "20c")}
          onChange={(e: any) => setTill({ ...till, "20c": e.target.value })}
        />
        <TextField
          inputLabel="10¢s"
          divClass="text-3xl"
          value={till["10c"]}
          error={isError(till, "10c")}
          onChange={(e: any) => setTill({ ...till, "10c": e.target.value })}
        />
      </div>
    </div>
  );
}

function isError(till: any, denom: string) {
  return (
    till[denom] && (isNaN(parseInt(till[denom])) || parseInt(till[denom]) < 0)
  );
}

export default CashMap;
