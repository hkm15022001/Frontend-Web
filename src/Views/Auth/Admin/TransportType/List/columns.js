export const COLUMNS = [
  {
    Header: "ID",
    accessor: "id",
    disableFilters: true,
  },
  {
    Header: 'Start info',
    columns: [
      {
        Header: "From",
        accessor: "location_one",
        disableFilters: true,
      },
      {
        Header: "SameCity",
        accessor: "same_city",
        disableFilters: true,
        Cell: ({ value }) => {
          let valueParse = value ? "Yes" : "No"
          return (
            <div
              style={{
                whiteSpace: "nowrap",
                width: 110,
                overflow: "hidden",
                textOverflow: "ellipsis",
                }} > { valueParse }
            </div>
          )
        },
      },
    ]
  },
  {
    Header: 'Long ship info',
    columns: [

      {
        Header: "To",
        accessor: "location_two",
        disableFilters: true,
      },
      {
        Header: "ServiceType",
        accessor: "service_type",
        disableFilters: true,
      },
      {
        Header: "Price/Km",
        accessor: "long_ship_price",
        disableFilters: true,
      },
    ]
  },
  {
    Header: 'Short ship info',
    columns: [
      {
        Header: "Price/Km",
        accessor: "short_ship_price_per_km",
        disableFilters: true,
      },
    ]
  },
  {
    Header: "Action",
  },
];
