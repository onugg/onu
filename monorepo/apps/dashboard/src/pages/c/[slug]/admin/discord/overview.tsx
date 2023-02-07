import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import AdminLayout from "@/components/layouts/primary/adminLayout";
import { Colors } from "chart.js";
import DiscordMenu from "@/components/layouts/adminMenus/discordMenu";
import { Line } from "react-chartjs-2";
import React from "react";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

const labels = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30,
];

const data = {
  labels: labels,
  datasets: [
    {
      borderColor: "#8b5cf6",
      backgroundColor: "#8b5cf6",
      label: "Messages Sent",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      color: "#8b5cf6",
    },
  },
};

type Props = {
  data: any;
  options: any;
};

const DiscordMessageLineChart: React.FC<Props> = ({ data, options }) => {
  return <Line options={options} data={data} />;
};

const stats = [
  {
    id: 1,
    name: "Total Subscribers",
    stat: "71,897",
    icon: UsersIcon,
    change: "122",
    changeType: "increase",
  },
  {
    id: 2,
    name: "Avg. Open Rate",
    stat: "58.16%",
    icon: EnvelopeOpenIcon,
    change: "5.4%",
    changeType: "increase",
  },
  {
    id: 3,
    name: "Avg. Click Rate",
    stat: "24.57%",
    icon: CursorArrowRaysIcon,
    change: "3.2%",
    changeType: "decrease",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const StatSquares: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-300">
        Last 30 days
      </h3>

      <dl className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-gray-900/70 px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-violet-500 p-3">
                <item.icon
                  className="h-6 w-6 text-gray-200"
                  aria-hidden="true"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-400">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-white">{item.stat}</p>
              <p
                className={classNames(
                  item.changeType === "increase"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600",
                  "ml-2 flex items-baseline rounded-full px-1.5 py-0.5 text-sm font-semibold"
                )}
              >
                {item.changeType === "increase" ? (
                  <ArrowUpIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                    aria-hidden="true"
                  />
                )}

                <span className="sr-only">
                  {" "}
                  {item.changeType === "increase"
                    ? "Increased"
                    : "Decreased"}{" "}
                  by{" "}
                </span>
                {item.change}
              </p>
              <div className="absolute inset-x-0 bottom-0 bg-gray-900 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-gray-300 hover:text-white"
                  >
                    {" "}
                    View all<span className="sr-only"> {item.name} stats</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const DiscordOverview: React.FC = () => {
  return (
    <AdminLayout>
      <DiscordMenu />
      <div className="grid w-full grid-flow-col grid-cols-3 grid-rows-2 gap-4 rounded-lg p-4">
        <div className="col-span-2 flex flex-col justify-between gap-2 rounded-2xl bg-gray-800 p-5">
          <StatSquares />
          <StatSquares />
        </div>
        <div className="col-span-2 rounded-2xl bg-gray-800" />
        <div className="row-span-2 rounded-2xl bg-gray-800" />
      </div>
      {/* <div className="h-96 w-1/2 border-4 ">
        <DiscordMessageLineChart data={data} options={options} />
      </div> */}
    </AdminLayout>
  );
};

export default DiscordOverview;
