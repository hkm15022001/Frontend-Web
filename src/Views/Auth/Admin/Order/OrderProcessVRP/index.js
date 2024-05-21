import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';

const OrderProcessVRP = () => {
  const [coordinatesPath, setCoordinatesPath] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [truckPath, setTruckPath] = useState([]);
  const [packageListResult, setPackageListResult] = useState({});

  useEffect(() => {
    // Thực hiện fetch API ở đây và cập nhật state
    // Ví dụ sử dụng fetch:
    fetch('/api/process/data')
      .then((response) => response.json())
      .then((data) => {
        setCoordinatesPath(data.coordinates_path);
        setTotalDistance(data.total_distance);
        setTruckPath(data.truck_path);
        setPackageListResult(data.package_list_result);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  const colors = ['red', 'blue', 'green','yellow']
  return (
    <div>
      <h2>Total Distance: {totalDistance}</h2>
      <h3>Truck Paths:</h3>
      {truckPath.map((path, index) => (
        <div key={index}>
          {path.map((step, stepIndex) => (
            <i key={stepIndex}>{step}|</i>
          ))}
        </div>
      ))}
      <h3>Package List Result:</h3>
      {Object.keys(packageListResult).map((key) => (
        <div key={key}>
          <p>{`Long ship ${key}: ${packageListResult[key].join(', ')}`}</p>
        </div>
      ))}
      <h3>Map:</h3>
      <MapContainer style={{ height: '400px', width: '100%' }} center={[21, 106]} zoom={7}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {coordinatesPath.map((path, index) => (
          <React.Fragment key={index}>
            {path.map((coords, i) => {
              // Nối các điểm trong cùng một mảng
              if (i < path.length - 1) {
                return (
                  <Polyline
                    key={i}
                    positions={[coords, path[i + 1]]}
                    color={colors[index % colors.length]} // Chọn màu dựa trên index của path
                  />
                );
              }
              return null;
            })}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default OrderProcessVRP;