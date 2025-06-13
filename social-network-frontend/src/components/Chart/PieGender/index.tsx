import { Box } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { reportStore } from "../../../store/reducers";
import { useSelector } from "react-redux";

const PieGender = () => {
  const maleCount = useSelector(reportStore.selectMale);
  const femaleCount = useSelector(reportStore.selectFemale);
  const data = [
    { name: "Male", value: maleCount },
    { name: "Female", value: femaleCount },
  ];

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <Box>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Box>
  );
};

export default PieGender;
