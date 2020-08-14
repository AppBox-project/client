import React from "react";
import { Skeleton } from "@material-ui/lab";

const NavBarSkeleton: React.FC = () => {
  return (
    <div style={{ width: 64, height: "100vh" }}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Skeleton
          key={i}
          variant="rect"
          height={48}
          width={48}
          style={{
            margin: 6,
            marginTop: 20,
            marginBottom: 25,
            borderRadius: 8,
          }}
        />
      ))}
    </div>
  );
};

export default NavBarSkeleton;
