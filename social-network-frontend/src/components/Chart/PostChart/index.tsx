import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { reportStore } from "../../../store/reducers";
import { useSelector } from "react-redux";

export default function PostChart() {
  const dataChart = useSelector(reportStore.selectDayCounts);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={dataChart}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dayOfWeek" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
