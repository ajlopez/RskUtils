# RSK Private Network Config Generator

Generate config files for a private network. Tested with Bamboo release.

## Install

Install NodeJS

Run
```
npm install
```

The `java` launcher should be in your path.

## Configure

Edit the `config.json` to point to your local RSK full jar (this utility was tested using Bamboo release):

```
{
	"jar": "rskj.jar"
}
```

## Generate Configuration Files

Run
```
node genconf
```

It generates three config files in `build` folder (one miner, two not miners). You can specify the number and kind
of nodes:

```
node genconf -m 2 -n 3
```
or
```
node genconf -miners 2 -notminers 3
```


The above commands generate TWO miners and THREE not miners.

You can launch each node running in a terminal:
```
java -cp <rskjarfile> -Drsk.conf.file=build/nodexx.conf co.rsk.Start
```

where `xx` is the number of node to launch (starting with 1).

Or you can run in a terminal:
```
node run <number>
```





