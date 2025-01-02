import * as path from 'path'
import { fileURLToPath } from 'url';
import excelToJson from 'convert-excel-to-json'

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

/*
   {
      label: "Some Entry",
      quadrant: 3,          // 0,1,2,3 (counting clockwise, starting from bottom right)
      ring: 2,              // 0,1,2,3 (starting from inside)
      moved: -1             // -1 = moved out (triangle pointing down)
                            //  0 = not moved (circle)
                            //  1 = moved in  (triangle pointing up)
                            //  2 = new       (star)
   },
*/
function parseRadarData(radarData){
  const RADAR_DATA_MAP = {
    ring: {
      ADOPT: 0,
      TRIAL: 1,
      ASSESS: 2,
      HOLD: 3,
    },
    quadrant: {
      TECHNIQUES: 2,
      PLATFORMS: 1,
      TOOLS: 3,
      LANGUAGESANDFRAMEWORKS: 0
    },
    status: {
      MOVEDIN: 1,
      NEW: 2,
      NOCHANGE: 0,
      MOVEDOUT: -1
    }
  }

  return radarData.map((element) =>{
    return {
      label: element.name,
      ring: RADAR_DATA_MAP.ring[element.ring.replaceAll(/[^a-zA-Z0-9]/g, '').toUpperCase()],
      quadrant:  RADAR_DATA_MAP.quadrant[element.quadrant.replaceAll(/[^a-zA-Z0-9]/g, '').toUpperCase()],
      moved: RADAR_DATA_MAP.status[element.status.replaceAll(/[^a-zA-Z0-9]/g, '').toUpperCase()]
    }
  });
}

export default async function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  const radarData = excelToJson({
    sourceFile: path.resolve(__dirname, 'radarData.xlsx'),
    header: {rows: 1},
    columnToKey:{
      A: 'name',
      B: 'ring',
      C: 'quadrant',
      D: 'isNew',
      E: 'status',
      F: 'description'
    }
  });
  
  eleventyConfig.addGlobalData("parsedRadarData", parseRadarData(radarData.Sheet1));

  //custom to json as the default one from nuchucks not parses correctly :D (safestring issue)
  eleventyConfig.addNunjucksTag("DKTooJSON", function (nunjucksEngine) {
    return new (function () {
      this.tags = ["DKTooJSON"];

      this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        return new nodes.CallExtensionAsync(this, "run", args);
      };

      this.run = function (context, myStringArg, callback) {
        //onpurpose not safe bcz else the json characters arethrere
        let ret = new nunjucksEngine.runtime.SafeString(
          JSON.stringify(myStringArg, undefined, 4)
        );
        callback(null, ret);
      };
    })();
  });


  return {
    dir: {
      input: "./site",
      output: "dist"
    }
  }
};