export default function Button ({ children, onClick, colorBg, disabled }) {
  return (
            <button className={colorBg + ' m-1 p-2 text-sm rounded-xl w-fit bg-slate-200 shadow-lg flex font-semibold disabled:bg-green-300'} onClick={onClick} disabled={disabled}>
                {children}
            </button>
  )
}
