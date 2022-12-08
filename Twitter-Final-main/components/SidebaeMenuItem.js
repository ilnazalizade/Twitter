

export default function SidebaeMenuItem({ text, Icon, ActiveIcon , active}) {
  return (
    <div className="hoverEffect flex items-center text-gray-700 justify-center xl:justify-start text-lg space-x-3">
      {(active && ActiveIcon) ?
          <ActiveIcon className="h-7"/>
          :
          <Icon className="h-7" />
      }
    <span className={`${active && "font-bold"} hidden xl:inline`}>{text}</span>
  </div>
  );
}
