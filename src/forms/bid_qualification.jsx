export const formSchema = {
  formName: "bid_qualification",
  name: "Bid Qualification",
  components: [
    {
      label: "Client Name",
      type: "textfield",
      layout: {
        row: "Row_0eovg20",
        columns: null,
      },
      id: "Field_006liie",
      key: "textfield_sfk9k",
      description: "What is the client's name?",
      validate: {
        required: true,
      },
    },
    {
      label: "Project Name",
      type: "textfield",
      layout: {
        row: "Row_0vc6y6n",
        columns: null,
      },
      id: "Field_072ly4h",
      key: "textfield_czgb1",
      description: "What is the project / opportunity name?",
      validate: {
        required: true,
      },
    },
    {
      label: "Client Intro",
      type: "textfield",
      layout: {
        row: "Row_0ivmsbl",
        columns: null,
      },
      id: "Field_080gmjz",
      key: "textfield_7hgh",
      description: "Please provide Client Intro (one liner)",
      validate: {
        required: true,
      },
    },
    {
      label: "Situation",
      type: "textfield",
      layout: {
        row: "Row_0d07ry8",
        columns: null,
      },
      id: "Field_1bvgbk7",
      key: "textfield_sa95j4",
      description:
        "What is the situation at the client that drives the opportunity?",
      validate: {
        required: true,
      },
    },
    {
      label: "Complication",
      type: "textfield",
      layout: {
        row: "Row_0i5xqev",
        columns: null,
      },
      id: "Field_1b6z7d2",
      key: "textfield_0cchc7",
      description: "What makes winning the opportunity complicated?",
      validate: {
        required: true,
      },
    },
    {
      label: "Company Opportunity",
      values: [
        {
          label: "Active Target List",
          value: "ActiveTargetList",
        },
        {
          label: "Priority Account",
          value: "PriorityAccount",
        },
        {
          label: "Ad-hoc Pursuit",
          value: "Adhoc",
        },
      ],
      type: "select",
      layout: {
        row: "Row_0tsmvpz",
        columns: null,
      },
      id: "Field_129hmch",
      key: "select_62ir6n",
      validate: {
        required: true,
      },
    },
    {
      label: "Priority Domain",
      values: [
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
        {
          label: "N/A",
          value: "none",
        },
      ],
      type: "select",
      layout: {
        row: "Row_1gz6t2r",
        columns: null,
      },
      id: "Field_1jbx2qg",
      key: "select_7ffzu9",
      description:
        "Is the client in a priority domain that we've identified as a target based on our expertise?",
      validate: {
        required: true,
      },
    },
    {
      label: "Win Potential",
      type: "textfield",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_0c6nnqi",
      key: "textfield_69fw9w",
      description:
        "Can we WIN and how? (win themes / quality / price / relationship / accelerators / cases.. why Vega IT)",
      validate: {
        required: true,
      },
    },
    {
      label: "Leverage",
      type: "textfield",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_15jac1v",
      key: "textfield_3vdd8",
      description:
        "Have we delivered similar work in other organizations, which we could leverage to win and profitably deliver on this specific opportunity? (e.g. consider domain, technical expertise and technology platform)",
      validate: {
        required: true,
      },
    },
    {
      label: "Do we have relationships and with whom?",
      type: "textfield",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_0qdi284",
      key: "textfield_um6p5g",
      validate: {
        required: true,
      },
    },
    {
      label: "Shape RFP",
      values: [
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],
      type: "radio",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_0yzl62m",
      key: "radio_fuuwl3",
      validate: {
        required: true,
      },
      description: "Did we have an opportunity to shape RFP in any way?",
    },
    {
      label: "What is the effort required to complete bid in Mandays ?",
      values: [
        {
          label: "1",
          value: "1",
        },
        {
          label: "10",
          value: "10",
        },
        {
          label: "15+",
          value: "over15",
        },
      ],
      type: "select",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_0asmp4v",
      key: "select_wji1pb",
      validate: {
        required: true,
      },
    },
    {
      label: "Contract Value in Euros",
      type: "textfield",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_0v0fcqd",
      key: "textfield_hklg3o",
      validate: {
        required: true,
      },
    },
    {
      label: "Expected Duration in months",
      type: "textfield",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_1ar82zi",
      key: "textfield_fjjr6s",
      validate: {
        required: true,
      },
    },
    {
      subtype: "date",
      dateLabel: "Submission Deadline",
      type: "datetime",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_15s9er3",
      key: "datetime_4u7usm",
      validate: {
        required: true,
      },
    },
    {
      label: "Salesforce Opportunity Link",
      type: "textfield",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_1hmd9x1",
      key: "textfield_i4cpnv",
      description:
        "Salesforce Opportunity link, so that we can easily import outcomes for further analysis and enhance Salesforce compliance",
      validate: {
        required: true,
      },
    },
    {
      label: "Opportunity Lead",
      type: "textfield",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_0hvm51r",
      key: "textfield_x8idd",
      validate: {
        required: true,
      },
    },
    {
      label: "Technical Sales Specialist",
      values: [
        {
          label: "Bojan Tadic",
          value: "BojanTadic",
        },
        {
          label: "Nemanja Sobo",
          value: "NemanjaSobo",
        },
        {
          label: "Nenad Percic",
          value: "NenadPercic",
        },
        {
          label: "Dejan Besic",
          value: "DejanBesic",
        },
        {
          label: "Mario Gula",
          value: "MarioGula",
        },
        {
          label: "Vukasin Jankovic",
          value: "VukasinJankovic",
        },
        {
          label: "Vuk Saric",
          value: "VukSaric ",
        },
      ],
      type: "select",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_08fbunq",
      key: "select_rtmet",
      validate: {
        required: true,
      },
    },
    {
      label: "Are the evaluation criteria clear?",
      values: [
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],
      type: "radio",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_1d3utev",
      key: "radio_v6ente",
      validate: {
        required: true,
      },
    },

    {
      label: "We have a winning team to deliver the project and bid?",
      values: [
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
        {
          label: "Don't Know",
          value: "unknown",
        },
      ],
      type: "radio",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_1w976md",
      key: "radio_15vhht",
      validate: {
        required: true,
      },
    },
    {
      label: "Signed off by the Presales Support",
      values: [
        {
          label: "Bojan Tadic",
          value: "BojanTadic",
        },
        {
          label: "Nenad Percic",
          value: "NenadPercic",
        },
        {
          label: "Nemanja Sobo",
          value: "NemanjaSobo",
        },
      ],
      type: "select",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_0fi4aak",
      key: "select_cwo3l4",
      validate: {
        required: true,
      },
    },
    {
      label: "Suggested type of support",
      values: [
        {
          label: "Gold",
          value: "gold",
        },
        {
          label: "Silver",
          value: "silver",
        },
        {
          label: "Bronze",
          value: "bronze",
        },
      ],
      type: "select",
      layout: {
        row: "Row_124xyrp",
        columns: null,
      },
      id: "Field_0tg7keu",
      key: "select_dfcl1",
      validate: {
        required: true,
      },
    },    {
      label: "Client Engagement Level",
      type: "slider",
      key: "slider_client_engagement",
      min: 0,
      max: 10,
      step: 1,
      layout: {
        row: "Row_slider",
        columns: null,
      },
      description:
        "Rate the engagement level of the client from 0 (low) to 10 (high)",
      validate: {
        required: true,
      },
    },
    {
      label: "Opportunity Evaluation Chart",
      type: "chart",
      key: "chart_1",
      keys: ["textfield_69fw9w", "textfield_3vdd8"],
    },
    {
      label: "Contract Overview Chart",
      type: "chart",
      key: "chart_2",
      keys: ["textfield_hklg3o", "textfield_fjjr6s"],
    },
    {
      label: "File test",
      type: "fileupload",
      layout: {
        row: "Row_082rt7l",
        columns: null,
      },
      id: "Field_1bmc2el",
      key: "attachment",
      description: "test file upload",
    },
  ],
};
