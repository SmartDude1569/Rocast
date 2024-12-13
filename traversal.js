// sex is cool but have you ever named your
// source code file something badass like
// traversal.js and it is actually relevant
// to what the code itself does

const { upnpNat } = await import("@achingbrain/nat-port-mapper");
const https = await import("https");

const client = await upnpNat({
    description: "Rocast NAT traversal"
});

let words = [];

(() => {
    words = "awkward:\
guiltless:\
hysterical:\
unique:\
jobless:\
gigantic:\
furry:\
amazing:\
giant:\
secret:\
invincible:\
naive:\
adventurous:\
ripe:\
substantial:\
lethal:\
psychedelic:\
wonderful:\
outgoing:\
understood:\
pleasant:\
vivacious:\
classy:\
future:\
psychotic:\
robust:\
imaginary:\
obsequious:\
alive:\
gainful:\
superb:\
married:\
wakeful:\
loving:\
careless:\
mountainous:\
useful:\
harmonious:\
scared:\
crazy:\
thoughtful:\
oafish:\
spiteful:\
snobbish:\
cool:\
recondite:\
agreeable:\
thick:\
cut:\
splendid:\
teeny:\
super:\
organic:\
tightfisted:\
useless:\
bitter:\
bashful:\
disillusioned:\
teeny-tiny:\
diligent:\
shut:\
absorbed:\
disgusted:\
panicky:\
halting:\
abusive:\
bustling:\
habitual:\
lonely:\
weak:\
obtainable:\
annoying:\
medical:\
dry:\
unadvised:\
tidy:\
warlike:\
luxuriant:\
lame:\
unbiased:\
ratty:\
observant:\
capricious:\
mundane:\
painful:\
sick:\
bent:\
sore:\
nasty:\
evanescent:\
lowly:\
ossified:\
fantastic:\
zesty:\
wandering:\
military:\
certain:\
chilly:\
unhealthy:\
colossal:\
separate:\
agonizing:\
righteous:\
good:\
immense:\
jealous:\
gleaming:\
overwrought:\
wide:\
well-made:\
demonic:\
jaded:\
bite-sized:\
kindly:\
silent:\
hateful:\
mean:\
thankful:\
equable:\
subdued:\
acrid:\
perfect:\
bored:\
deeply:\
lyrical:\
childlike:\
imperfect:\
gamy:\
goofy:\
squeamish:\
boundless:\
slimy:\
imported:\
well-to-do:\
polite:\
same:\
last:\
large:\
trashy:\
present:\
abrupt:\
new:\
healthy:\
coherent:\
gabby:\
subsequent:\
placid:\
royal:\
round:\
macho:\
aloof:\
obeisant:\
alleged:\
lively:\
entertaining:\
ill-fated:\
draconian:\
public:\
magical:\
dysfunctional:\
eminent:\
poised:\
wooden:\
barbarous:\
dispensable:\
physical:\
wry:\
juicy:\
special:\
witty:\
fixed:\
old-fashioned:\
far:\
husky:\
uninterested:\
tense:\
shocking:\
quick:\
smart:\
elastic:\
savory:\
forgetful:\
strange:\
zany:\
empty:\
glistening:\
woebegone:\
standing:\
striped:\
caring:\
graceful:\
low:\
shaggy:\
dusty:\
ethereal:\
false:\
nostalgic:\
educated:\
judicious:\
mammoth:\
onerous:\
roomy:\
noiseless:\
hospitable:\
poor:\
sticky:\
stimulating:\
encouraging:\
breezy:\
dramatic:\
light:\
nosy:\
cloudy:\
powerful:\
common:\
efficient:\
frightened:\
peaceful:\
ubiquitous:\
dangerous:\
flagrant:\
chubby:\
offbeat:\
irate:\
familiar:\
apathetic:\
crabby:\
eager:\
old:\
third:\
outrageous:\
lovely:\
filthy:\
absent:\
ugly:\
feeble:\
creepy:\
courageous:\
nimble:\
shallow:\
nonstop:\
young:\
scary:\
accurate:\
necessary:\
aromatic:\
stormy:\
fine:\
cooing:\
slippery:\
malicious:\
scintillating:\
direful:\
true:\
fretful:\
shrill".split(":");
})();

export function getFriendlyName(publicIp, portDelta) {
    if (publicIp.indexOf(":") != -1) {
        console.error("ABORT! ABORT! IPv6 HAS FUCKED US OVER AGAIN!");
        process.exit(1);
    }
    let numbers = publicIp.split(".");
    numbers.push(`${portDelta}`);
    let name = "";
    for (let i = 0; i < numbers.length; i++) {
        name = `${name}${words[numbers[i]]} `;
    }
    return name;
};

export async function getAvailablePort() {
    let dPort = Math.floor(Math.random() * 255);
    await client.map(7500 + dPort, {
        protocol: "TCP"
    });
    return dPort;
};

export async function closePort(dPort) {
    await client.unmap(7500 + dPort);
};

export async function getPublicIp() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "api.ipify.org",
            path: "/?format=json",
            method: "GET",
        };
        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.ip);
                } catch (error) {
                    reject(new Error("Failed to parse response from api.ipify.org"));
                }
            });
        });
        req.on("error", (error) => {
            reject(error);
        });
        req.end();
    });
}