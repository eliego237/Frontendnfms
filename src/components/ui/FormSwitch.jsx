import { Switch } from "@headlessui/react";

export default function FormSwitch({

    label,

    description,

    checked,

    onChange

}){

return(

<div className="flex items-center justify-between rounded-2xl border bg-slate-50 p-5">

<div>

<h3 className="font-semibold">

{label}

</h3>

<p className="text-sm text-slate-500">

{description}

</p>

</div>

<Switch

checked={checked}

onChange={onChange}

className={`

${checked

? "bg-blue-600"

: "bg-slate-300"

}

relative inline-flex h-7 w-14 items-center rounded-full transition

`}

>

<span

className={`

${checked

? "translate-x-8"

: "translate-x-1"

}

inline-block h-5 w-5 transform rounded-full bg-white transition

`}

/>

</Switch>

</div>

)

}