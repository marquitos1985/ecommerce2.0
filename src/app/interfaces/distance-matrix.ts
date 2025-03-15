export interface DistanceMatrix {

    "destination_addresses": [
            string
        ],
        "origin_addresses": [
            string
        ],
        "rows": [
            {
                "elements": [
                    {
                        "distance": {
                            "text": string,
                            "value": number
                        },
                        "duration": {
                            "text": string,
                            "value": number
                        },
                        "origin": string,
                        "destination":string,
                        "status": string
                    }
                ]
            }
        ],
        "status": string

}
