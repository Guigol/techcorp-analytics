import { FaEuroSign, FaTools, FaBuilding, FaUsers } from "react-icons/fa";

const GradientNeonIcon = ({ Icon, gradientId, stops }) => (
  <svg className="w-10 h-10 animate-pulse" viewBox="0 0 24 24">
    <defs>
      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        {stops.map((stop, idx) => (
          <stop key={idx} offset={stop.offset} stopColor={stop.color} />
        ))}
      </linearGradient>
      <filter id={`${gradientId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <Icon fill={`url(#${gradientId})`} filter={`url(#${gradientId}-glow)`} />
  </svg>
);

export default function DashboardCards() {
  const cardClasses =
    "bg-white dark:bg-gray-800 rounded-lg p-4 relative border-2 border-gray-300 dark:border-gray-600 shadow-2xl";

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <div className={cardClasses}>
        <div className="absolute top-4 right-4">
          <GradientNeonIcon
            Icon={FaEuroSign}
            gradientId="gradBudget"
            stops={[
              { offset: "0%", color: "#00f0ff" },
              { offset: "50%", color: "#1e90ff" },
              { offset: "100%", color: "#00ffea" }
            ]}
          />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Budget</p>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          €28,750 / €30k{" "}
          <span className="ml-2 inline-block text-sm font-semibold px-3 py-1 rounded-full bg-blue-400 text-white">
            +12%
          </span>
        </p>
      </div>

      <div className={cardClasses}>
        <div className="absolute top-4 right-4">
          <GradientNeonIcon
            Icon={FaTools}
            gradientId="gradTools"
            stops={[
              { offset: "0%", color: "#ffb347" },
              { offset: "50%", color: "#ffcc33" },
              { offset: "100%", color: "#ffa500" }
            ]}
          />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Active Tools</p>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          147{" "}
          <span className="ml-2 inline-block text-sm font-semibold px-3 py-1 rounded-full bg-yellow-400 text-white">
            +8
          </span>
        </p>
      </div>

      <div className={cardClasses}>
        <div className="absolute top-4 right-4">
          <GradientNeonIcon
            Icon={FaBuilding}
            gradientId="gradDept"
            stops={[
              { offset: "0%", color: "#ff00ff" },
              { offset: "50%", color: "#8a2be2" },
              { offset: "100%", color: "#da70d6" }
            ]}
          />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Departments</p>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          8{" "}
          <span className="ml-2 inline-block text-sm font-semibold px-3 py-1 rounded-full bg-purple-500 text-white">
            +2
          </span>
        </p>
      </div>

      <div className={cardClasses}>
        <div className="absolute top-4 right-4">
          <GradientNeonIcon
            Icon={FaUsers}
            gradientId="gradCost"
            stops={[
              { offset: "0%", color: "#32cd32" },
              { offset: "50%", color: "#7cfc00" },
              { offset: "100%", color: "#00ff7f" }
            ]}
          />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Cost per User</p>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          €156{" "}
          <span className="ml-2 inline-block text-sm font-semibold px-3 py-1 rounded-full bg-green-500 text-white">
            +€10
          </span>
        </p>
      </div>
    </div>
  );
}
